const {
  isValidEmail,
  isValidPassword,
  hashPassword,
  generateToken,
  handleError,
  checkPassword,
  verifyToken,
  checkAdminOrOwner,
  isValidPhone,
} = require("../helper/authHelpers");
const { UserModel } = require("../models/UserModel");
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinaryConfig");
const upload = require("../middlewares/multer");
const fs = require("fs");
require("dotenv").config();

router.get("/users", async (req, res) => {
  try {
    // Lấy tất cả người dùng
    const users = await UserModel.find().select("-password"); // Lấy tất cả trường trừ trường password

    // Kiểm tra nếu không có người dùng nào
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có người dùng nào.",
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Lấy thông tin user theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ (Mongoose ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ.",
      });
    }

    // Tìm người dùng theo ID
    const user = await UserModel.findById(id).select("-password");

    // Kiểm tra nếu không tìm thấy user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Trả về thông tin người dùng
    res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công.",
      user: user,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại.",
      });
    }

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0]; // Lấy public_id từ URL
      await cloudinary.uploader.destroy(publicId); // Xóa ảnh trên Cloudinary
    }

    // Xóa người dùng
    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Người dùng đã được xóa thành công.",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, phone, password, fullName } = req.body;

    // Kiểm tra các trường bắt buộc
    const checkRequiredFields = (fields) => {
      for (const [key, value] of Object.entries(fields)) {
        if (!value) {
          return `${key} là bắt buộc.`;
        }
      }
      return null;
    };
    const missingField = checkRequiredFields({
      username,
      phone,
      password,
      fullName,
    });
    if (missingField) {
      return res.status(400).json({
        success: false,
        message: missingField,
        type: "error",
      });
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ.",
        type: "error",
      });
    }

    // Kiểm tra mật khẩu
    const passwordErrors = isValidPassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không hợp lệ.",
        errors: passwordErrors, // Trả về danh sách lỗi
        type: "error",
      });
    }

    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tên người dùng đã tồn tại.",
        type: "error",
      });
    }

    // Kiểm tra nếu người dùng đã tồn tại
    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã tồn tại.",
        type: "error",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo người dùng mới
    const newUser = new UserModel({
      username,
      phone,
      password: hashedPassword,
      fullName,
    });

    await newUser.save();
    // Xóa trường password trước khi trả về
    const sanitizedUser = newUser.toObject();
    delete sanitizedUser.password;

    // Tạo token cho người dùng
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Đăng ký thành công",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { usernameOrPhone, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!usernameOrPhone) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc số điện thoại là bắt buộc.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu là bắt buộc.",
      });
    }

    // Kiểm tra nếu `usernameOrPhone` là số điện thoại
    const isPhone = /^[0-9]{10,15}$/.test(usernameOrPhone);

    // Tìm người dùng bằng username hoặc phone
    const user = await UserModel.findOne(
      isPhone ? { phone: usernameOrPhone } : { username: usernameOrPhone }
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    // Xóa mật khẩu trước khi trả về
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    // Tạo token JWT
    const token = generateToken(user);

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/authencation/signin", async (req, res) => {
  try {
    const { usernameOrPhone, password, rememberMe } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!usernameOrPhone) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc số điện thoại là bắt buộc.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu là bắt buộc.",
      });
    }

    // Kiểm tra nếu `usernameOrPhone` là số điện thoại
    const isPhone = /^[0-9]{10,15}$/.test(usernameOrPhone);

    // Tìm người dùng bằng username hoặc phone
    const user = await UserModel.findOne(
      isPhone ? { phone: usernameOrPhone } : { username: usernameOrPhone }
    );

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, số điện thoại hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    // Kiểm tra vai trò Admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập (admin only).",
      });
    }

    // Cập nhật trạng thái "rememberMe" trong cơ sở dữ liệu (nếu cần)
    user.rememberMe = rememberMe;
    // Lưu lại user với rememberMe
    await user.save();
    // Tạo token JWT
    const token = generateToken(user);

    // Xóa mật khẩu trước khi trả về
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      user: sanitizedUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// API cập nhật thông tin người dùng
router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, fullName, role, isActive } = req.body;

    // Kiểm tra ID hợp lệ
    const { ObjectId } = require("mongoose").Types;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ.",
      });
    }

    // Tìm user
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Kiểm tra email
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ.",
      });
    }

    // Kiểm tra số điện thoại
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ.",
      });
    }

    // Xử lý avatar nếu có file upload
    let updatedAvatar = user.avatar;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          public_id: `user_${id}`,
          overwrite: true,
        });
        updatedAvatar = result.secure_url;

        // Xóa file tạm
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Không thể tải lên ảnh avatar.",
          error: uploadError.message,
        });
      }
    }

    // Cập nhật thông tin
    const updatedData = {
      username: username || user.username,
      email: email || user.email,
      phone: phone || user.phone,
      fullName: fullName || user.fullName,
      role: role || user.role,
      isActive: isActive === undefined ? user.isActive : isActive,
      avatar: updatedAvatar,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password");

    // Trả về kết quả
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin người dùng thành công.",
      user: updatedUser,
    });
  } catch (error) {
    // Xóa file tạm nếu có lỗi
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error updating user:", error);
    handleError(res, error);
  }
});

module.exports = router;
