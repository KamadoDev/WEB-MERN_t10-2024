const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        color: String,
        size: String,

        images: [String],
      },
    ],
    isVouched: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      province: String,
      provinceCode: String,
      district: String,
      districtCode: String,
      ward: String,
      wardCode: String,
      detail: String, // Số nhà, tên đường...
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Tạo virtual cho thuộc tính id
OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Cấu hình JSON để bao gồm các thuộc tính ảo (virtuals)
OrderSchema.set("toJSON", {
  virtuals: true,
});

// Xuất cả CategoryModel và OrderSchema
module.exports = {
  OrderModel: mongoose.model("Order", OrderSchema),
  OrderSchema: OrderSchema,
};
