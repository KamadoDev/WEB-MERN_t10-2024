const express = require("express");
const { isValidPhone, verifyToken } = require("../helper/authHelpers");
const { OrderModel } = require("../models/OrderModel");
const { CartModel } = require("../models/CartModel"); // Import CartModel
const router = express.Router();

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Lấy userId từ tham số trong URL
    const { userId } = req.params;

    // Kiểm tra xem người dùng đã xác thực có trùng với userId trong URL không (kiểm tra bảo mật tùy chọn)
    if (req.user.id !== userId) {
      return res.status(403).json({
        status: false,
        message: "Truy cập không được phép",
        type: "error",
      });
    }

    // Lấy danh sách đơn hàng của người dùng
    const orders = await OrderModel.find({ userId }).sort({
      createdAt: -1,
    });

    // Nếu không có đơn hàng hoặc giỏ hàng, trả về thông báo
    if (!orders.length) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy đơn hàng của bạn",
        type: "error",
      });
    }

    // Trả về thông tin đơn hàng
    res.status(200).json({
      status: true,
      message: "Danh sách đơn hàng của bạn",
      type: "success",
      orders,
    });
  } catch (error) {
    console.error(error); // Ghi log lỗi để hỗ trợ debug
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      detail,
      notes,
      paymentMethod,
      userId,
      items,
      isVoucher,
      voucherCode,
      discountPercentage,
      appliedDate,
      province,
      provinceCode,
      district,
      districtCode,
      ward,
      wardCode,
      date,
      totalPrice,
    } = req.body;

    // Kiểm tra các trường dữ liệu bắt buộc
    const requiredFields = [
      { field: fullName, message: "Vui lòng điền tên người đặt hàng" },
      { field: phone, message: "Vui lòng nhập số điện người đặt hàng" },
      { field: province, message: "Vui lòng chọn tỉnh thành" },
      { field: district, message: "Vui lòng chọn huyện" },
      { field: ward, message: "Vui lòng chọn xã" },
      { field: detail, message: "Số nhà hoặc thôn làng nơi gần bạn nhất" },
      { field: paymentMethod, message: "Vui lòng chọn phương thức thanh toán" },
    ];

    for (const { field, message } of requiredFields) {
      if (!field && field !== 0) {
        return res
          .status(400)
          .json({ status: false, message: message, type: "error" });
      }
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        status: false,
        message: "Số điện thoại không hợp lệ.",
        type: "error",
      });
    }

    // Tạo đơn hàng mới
    const newOrder = new OrderModel({
      userId: userId,
      items: items,
      isVouched: isVoucher
        ? [
            {
              voucherCode: voucherCode,
              discountPercentage: discountPercentage,
              appliedDate: appliedDate,
            },
          ]
        : [],
      totalPrice: totalPrice,
      address: {
        province,
        provinceCode,
        district,
        districtCode,
        ward,
        wardCode,
        phone,
        detail,
        notes,
      },
      paymentMethod,
      orderDate: new Date(),
      status: "Pending",
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    // Xóa giỏ hàng của người dùng sau khi đơn hàng được tạo
    await CartModel.findOneAndDelete({ userId: userId });

    // Trả về thông tin đơn hàng đã lưu
    res.status(201).json({
      status: true,
      message: "Đơn hàng đã được tạo thành công!",
      type: "success",
      order: savedOrder, // Gửi lại thông tin đơn hàng đã tạo
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "An error occurred while creating the order",
      type: "error",
    });
  }
});

module.exports = router;
