const {
  isValidEmail,
  isValidPassword,
  hashPassword,
  generateToken,
  handleError,
  checkPassword,
  verifyToken,
  checkAdminOrOwner,
} = require("../helper/authHelpers");
const { UserModel } = require("../models/UserModel");
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinaryConfig");
const upload = require("../middlewares/multer");
const fs = require("fs");
require("dotenv").config();

router.get("/users", verifyToken, checkAdminOrOwner, async (req, res) => {
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
router.get("/:id", verifyToken, checkAdminOrOwner, async (req, res) => {
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
    const user = await UserModel.findById(id);

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
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", verifyToken, checkAdminOrOwner, async (req, res) => {
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
    const { username, email, password, fullName } = req.body;

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
      email,
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

    // Kiểm tra tính hợp lệ của email và mật khẩu
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email không hợp lệ." });
    }

    // Kiểm tra mật khẩu
    const passwordErrors = isValidPassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không hợp lệ.",
        errors: passwordErrors, // Trả về danh sách lỗi
      });
    }

    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Tên người dùng đã tồn tại." });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo người dùng mới
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    await newUser.save();

    // Tạo token cho người dùng
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Đăng ký thành công",
      user: newUser,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc email là bắt buộc.",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu là bắt buộc.",
      });
    }

    // Nếu email được cung cấp, kiểm tra hợp lệ
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ.",
      });
    }

    // Tìm người dùng qua username hoặc email
    const user = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, email hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập, email hoặc mật khẩu không đúng.",
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa.",
      });
    }

    // Tạo token JWT
    const token = generateToken(user);

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// API cập nhật thông tin người dùng
router.put(
  "/:id",
  verifyToken,
  checkAdminOrOwner,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, fullName, role, isActive } = req.body;

      // Kiểm tra ID hợp lệ
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
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

      // Cập nhật avatar nếu có
      let updatedAvatar = user.avatar;
      if (req.file) {
        // Tải ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          public_id: `user_${id}`, // Đặt tên file dựa theo user ID
          overwrite: true, // Ghi đè nếu đã tồn tại
        });

        // Lấy URL ảnh từ Cloudinary
        updatedAvatar = result.secure_url;

        // Xóa file tạm
        fs.unlinkSync(req.file.path);
      }

      // Cập nhật thông tin
      const updatedData = {
        username: username || user.username,
        email: email || user.email,
        fullName: fullName || user.fullName,
        role: role || user.role,
        isActive: isActive === undefined ? user.isActive : isActive,
        avatar: updatedAvatar,
      };

      const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {
        new: true, // Trả về dữ liệu sau khi cập nhật
        runValidators: true, // Kiểm tra các điều kiện trong schema
      });

      // Xóa trường password trước khi trả về
      const sanitizedUser = updatedUser.toObject();
      delete sanitizedUser.password;

      // Trả về kết quả
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công.",
        user: sanitizedUser,
      });
    } catch (error) {
      // Xóa file tạm nếu có lỗi xảy ra
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      handleError(res, error);
    }
  }
);

module.exports = router;
