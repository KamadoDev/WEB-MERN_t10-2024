import { Button, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import QuantityBox from "../../Components/QuantityBox";
import { GoTrash } from "react-icons/go";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, getData, putData } from "../../utils/api";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Voucher from "../../Components/Voucher";

const Cart = () => {
  const context = useContext(MyContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const calculator = (price, discount) => {
    const discountPrice = price * (discount / 100);
    const discountedPrice = price - discountPrice;
    return parseFloat(discountedPrice);
  };

  const applyDiscount = (discount, updatedPrice) => {
    // Cập nhật giá trị khi áp dụng mã giảm giá
    setFinalPrice(updatedPrice);
  };

  const handleQuantityChange = (newQuantity, productId, size, color) => {
    console.log(
      "newQuantity, productId, size, color",
      newQuantity,
      productId,
      size,
      color
    );
    context.setCartData((prevData) => {
      const updatedItems = prevData.items.map((item) =>
        item.productId.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      return { ...prevData, items: updatedItems };
    });

    // Optional: Cập nhật API nếu cần
    updateCart(productId, newQuantity, size, color);
  };

  const [loadingCart, setLoadingCart] = useState(false);
  const updateCart = async (productId, newQuantity, size, color) => {
    setLoadingCart(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại.");
        return;
      }

      const newCartFields = {
        userId: context.userData.userId,
        productId: productId,
        quantity: newQuantity,
        size: size,
        color: color,
      };

      const response = await putData(`/api/cart/updateCart`, newCartFields, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });
      console.log("Response from server:", response);
      if (response.status === true) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
        fetchData();
        setLoadingCart(false);
      } else {
        console.log(response.message);
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
        setLoadingCart(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      setLoadingCart(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoadingCart(false);
      }, 5000);
    }
  };

  const removeCart = async (productId) => {
    setLoadingCart(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData.userId;

      // Xử lý yêu cầu xóa sản phẩm
      const response = await deleteData(
        `/api/cart/removeCart/${userId}`,
        { productId }, // Truyền productId trong body yêu cầu
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        }
      );

      // Kiểm tra phản hồi và thực hiện các bước sau khi xóa thành công
      if (response.status) {
        // Cập nhật giỏ hàng trong UI nếu cần
        console.log("Sản phẩm đã được xóa khỏi giỏ hàng");
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
        fetchData();
        setLoadingCart(false);
      } else {
        console.error("Lỗi xóa sản phẩm", response.message);
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
        setLoadingCart(false);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error.message);
      setLoadingCart(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoadingCart(false);
      }, 5000);
    }
  };

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại.");
        return;
      }
      const response = await getData(
        `/api/cart/getCart/${context.userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dữ liệu giỏ hàng:", response);
      context.setCartData(response); // Cập nhật dữ liệu giỏ hàng
      setTotalPrice(response.totalPrice);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [context.userData.userId]); // Phụ thuộc vào userId để gọi lại khi userId thay đổi

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div className="position-fixed" style={{ right: "20px", zIndex: "100" }}>
        {context.alertBox.open === true && (
          <Collapse in={context.alertBox.open}>
            <Alert
              severity={context.alertBox.type}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    context.setAlertBox({
                      open: false,
                    });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {context.alertBox.message}
            </Alert>
          </Collapse>
        )}
      </div>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd text-capitalize">Giỏ hàng của bạn</h2>
          <p>
            {context.cartData?.items ? (
              <>
                Có{" "}
                <span className="badge badge-danger">
                  {context.cartData.items.length}
                </span>{" "}
                sản phẩm trong giỏ hàng của bạn
              </>
            ) : (
              "Giỏ hàng của bạn đang trống"
            )}
          </p>
          <div className="row">
            <div className="col-md-9">
              <div className="table-responsive">
                <table className="table text-left">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Size</th>
                      <th>Màu</th>
                      <th>Giảm giá</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Tổng phụ</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {context.cartData?.items?.lenght !== 0 &&
                      context.cartData?.items?.map((item, index) => {
                        return (
                          <tr>
                            <td key={item.productId.id}>
                              <Link to={`/product/${item.productId.id}`}>
                                <div className="d-flex align-items-center cartItemImg">
                                  <div className="imgWrapper">
                                    <img
                                      className="w-100"
                                      src={item.images}
                                      alt={item.productId.name}
                                    />
                                  </div>
                                  <div className="info px-3">
                                    <h6 className="text-ellipsis">
                                      {item.productId.name.substr(0, 20) +
                                        "..."}
                                    </h6>
                                    <Rating
                                      name="read-only"
                                      value={parseInt(item.productId.rating)}
                                      precision={0.5}
                                      size="small"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-info">
                                {item.size}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-info">
                                {item.color}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-danger">
                                {item.productId.discount > 0
                                  ? item.productId.discount
                                  : 0}
                                %
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div>
                                  {item.productId.discount > 0 ? (
                                    <del>
                                      {formatCurrency(item.productId.price)}
                                    </del>
                                  ) : (
                                    formatCurrency(item.productId.price)
                                  )}
                                </div>
                                <div>
                                  {item.productId.discount > 0
                                    ? formatCurrency(
                                        calculator(
                                          item.productId.price,
                                          item.productId.discount
                                        )
                                      )
                                    : ""}
                                </div>
                              </div>
                            </td>
                            <td>
                              <QuantityBox
                                quantity={item.quantity} // Truyền số lượng ban đầu
                                onQuantityChange={(newQuantity) =>
                                  handleQuantityChange(
                                    newQuantity,
                                    item.productId.id,
                                    item.size,
                                    item.color
                                  )
                                }
                              />
                            </td>
                            <td>{formatCurrency(item.price)}</td>
                            <td
                              className="remove"
                              onClick={() => removeCart(item.productId.id)}
                            >
                              <GoTrash />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card p-3 cartDetails">
                <h4 className="text-center text-uppercase mb-3 text-capitalize ">
                  Tổng số giỏ hàng
                </h4>
                <div className="d-flex align-items-center mb-3">
                  <span>Tổng phụ</span>
                  <span className="priceCart ml-auto font-weight-bold">
                    {formatCurrency(parseFloat(totalPrice))}
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span className="text-capitalize">vận chuyển</span>
                  <span className="ml-auto text-capitalize">
                    <b>Miễn phí</b>
                  </span>
                </div>
                {/* <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto">
                    <b>United Kingdom</b>
                  </span>
                </div> */}
                <Voucher
                  totalPrice={totalPrice}
                  applyDiscount={applyDiscount}
                />
                <div className="d-flex align-items-center mb-3">
                  <span>Tổng phải trả</span>
                  <span className="priceCart ml-auto font-weight-bold">
                    {formatCurrency(
                      parseFloat(finalPrice > 0 ? finalPrice : totalPrice)
                    )}
                  </span>
                </div>

                <Link to="">
                  <Button className="w-100 btn-blue text-capitalize bg-red btn-lg btn-big btnCheckout">
                    <MdOutlineShoppingCartCheckout />
                    Đặt hàng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
