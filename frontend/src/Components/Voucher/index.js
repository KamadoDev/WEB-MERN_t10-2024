import React, { useState } from "react";
import { BiSolidDiscount } from "react-icons/bi";
import { postData } from "../../utils/api";
import { Button } from "@mui/material";

const Voucher = ({ totalPrice, applyDiscount }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [isApplied, setIsApplied] = useState(false); // Trạng thái để kiểm soát nút

  const handleApplyDiscount = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      console.log("Khong co token");
      return;
    }
    const dataProp = {
      code: discountCode,
      totalPrice,
    };
    try {
      const response = await postData("/api/voucher/apply", dataProp, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });

      if (response.status) {
        // Nếu mã hợp lệ
        setMessage(response.message);
        setIsValid(true);
        setIsApplied(true); // Đánh dấu mã đã áp dụng
        applyDiscount(response.discount, response.finalPrice);
      } else {
        // Nếu mã không hợp lệ
        setMessage(response.message);
        setIsValid(false);
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi áp dụng mã giảm giá");
      setIsValid(false);
    }
  };

  return (
    <div className="d-flex align-items-center flex-column mb-5">
      <p className="mb-2">Mã giảm giá (Nếu có)</p>
      <div className="discountCode">
        <div className="iconDiscount">
          <BiSolidDiscount />
        </div>
        <input
          type="text"
          id="discount-code"
          className="input-discount form-control mr-2"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          disabled={isApplied} // Vô hiệu hóa nếu đã áp dụng mã giảm giá
        />
        <Button
          className="mt-2 text-capitalize bg-red btnCheckout"
          onClick={handleApplyDiscount}
          disabled={isApplied} // Vô hiệu hóa nếu đã áp dụng mã giảm giá
          
        >
          Áp dụng
        </Button>
        {message && (
          <p className={`checkCode ${isValid ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Voucher;
