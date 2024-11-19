const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

// Kiểm tra email hợp lệ
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Kiểm tra độ dài mật khẩu hợp lệ
const isValidPassword = (password) => {
  const errors = [];
  const minLength = 8;

  if (password.length < minLength) {
    errors.push(`Mật khẩu phải chứa ít nhất ${minLength} ký tự.`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết hoa.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết thường.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một chữ số.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*...).");
  }

  return errors;
};

// Xử lý lỗi
const handleError = (res, error) => {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
};

// Mã hóa mật khẩu
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Kiểm tra mật khẩu
const checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION || "1h" }
  );
};

// Xác thực JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization
  console.log("Token received: ", token); // In token ra để kiểm tra
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Token không được cung cấp",
    });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào req.user
    next(); // Tiếp tục với các middleware hoặc route handler tiếp theo
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

const checkAdminOrOwner = async (req, res, next) => {
  const { id } = req.params;
  const userIdFromToken = req.user.id; // Lấy ID từ token đã xác thực
  const userRoleFromToken = req.user.role; // Lấy role từ token

  if (userRoleFromToken === "admin" || userIdFromToken === id) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Bạn không có quyền thực hiện hành động này.",
  });
};

const authJwt = () => {
  const secret = process.env.JWT_SECRET;

  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header Authorization

    if (!token) {
      return res.status(403).json({ message: "Token không được cung cấp." });
    }

    // Xác thực và giải mã token
    jwt.verify(token, secret, { algorithms: ["HS256"] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token không hợp lệ." });
      }

      req.user = decoded; // Lưu thông tin người dùng đã giải mã vào request
      next(); // Tiến hành với các middleware hoặc route tiếp theo
    });
  };
};

module.exports = {
  hashPassword,
  checkPassword,
  verifyToken,
  generateToken,
  handleError,
  isValidEmail,
  isValidPassword,
  checkAdminOrOwner,
  authJwt,
};
