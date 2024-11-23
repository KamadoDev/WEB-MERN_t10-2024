import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { Button } from "@mui/material";
import { BsCartPlusFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ProductItemSlide from "../../Components/ProductItemSlide";
import RelatedProducts from "../../Components/RelatedProducts";
import { getData, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useContext } from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [valueRating, setValueRating] = useState(5);
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const [quantityVal, setQuantityVal] = useState();

  const isActive = (type, index, value) => {
    switch (type) {
      case "size":
        setActiveSize(index);
        setSelectedSize(value);
        break;
      case "color":
        setActiveColor(index);
        setSelectedColor(value);
        break;
      case "tab":
        setActiveTabs(index);
        break;
      case "tag":
        setActiveTag(index);
        setSelectedTag(value);
        break;
      default:
        break;
    }
  };

  const onQuantityChange = (value) => {
    console.log("quantity productDetail", value);
    setQuantityVal(value);
  };

  const [loadingCart, setLoadingCart] = useState(false);

  const addCart = async (id) => {
    setLoadingCart(true);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const newCartFields = {
      userId: context.userData.userId,
      productId: id,
      quantity: quantityVal,
      size: selectedSize,
      color: selectedColor,
    };

    try {
      // Gửi dữ liệu lên server
      const response = await postData(`/api/cart/addCart`, newCartFields, {
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
        setTimeout(() => {
          history("/cart");
        }, 1000);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      getData(`/api/products/${id}`).then((data) => {
        setProduct(data);
        getData(
          `/api/products/related?catID=${data.product.category.id}&tag=${
            selectedTag || ""
          }`
        ).then((data) => {
          const filteredData = data?.products?.filter((item) => item.id !== id);
          console.log("Sản phẩm liên quan", filteredData);
          setRelatedProduct(filteredData);
          setLoading(false);
        });
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [id, selectedTag]);

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
      <section className="productDetails section">
        {loading ? (
          <div className="text-center w-100">
            <CircularProgress className="" />
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-md-4 pl-5">
                <ProductZoom
                  images={product?.product?.images}
                  discount={product?.product?.discount}
                />
              </div>
              <div className="col-md-8 pl-5 pr-5">
                <h2 className="hd text-capitalize">{product?.product?.name}</h2>
                <ul className="list list-inline mb-0 d-flex align-items-center">
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center ">
                      <span className="text-gray mr-2">Thương hiệu:</span>
                      <span className="text-drak badge badge-danger">
                        {product?.product?.brand}
                      </span>
                    </div>
                  </li>
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center ">
                      <span className="text-gray mr-2">Danh mục:</span>
                      <span className="text-drak badge badge-info p-1">
                        {product?.product?.category?.name}
                      </span>
                    </div>
                  </li>
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center">
                      <Rating
                        name="read-only"
                        value={parseInt(product?.product?.rating)}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <span className="text-gray text-capitalize ml-2">
                        {" "}
                        {product?.product?.numberReviews > 0 &&
                          product?.product?.numberReviews}
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="d-flex my-3">
                  {product?.product?.old_price < product?.product?.price ? (
                    <span className="newPrice text-danger ml-2">
                      {formatCurrency(product?.product?.price)}
                    </span>
                  ) : (
                    <>
                      <span className="oldPrice">
                        {formatCurrency(product?.product?.old_price)}
                      </span>
                      <span className="newPrice text-danger ml-2">
                        {formatCurrency(product?.product?.price)}
                      </span>
                    </>
                  )}
                </div>

                {product?.product?.productInStock <= 0 ? (
                  <span className="badge badge-span bg-danger text-white">
                    Out of stock
                  </span>
                ) : (
                  <span className="badge badge-span bg-success text-white">
                    In stock
                  </span>
                )}

                <p className="mt-2 mb-0">
                  Mô tả ngắn:{" "}
                  {product?.product?.description.substr(0, 50) + "..."}
                </p>

                <div className="d-flex align-items-center productSize">
                  <span>Size: </span>
                  <ul className="list list-inline mb-0 pl-4">
                    {product?.product?.size?.map((item, index) => (
                      <li className="list-inline-item" key={index}>
                        <Link
                          onClick={() => isActive("size", index, item)}
                          className={`tag ${
                            activeSize === index ? "active" : ""
                          }`}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-flex align-items-center productSize">
                  <span>Màu: </span>
                  <ul className="list list-inline mb-0 pl-4">
                    {product?.product?.colors?.map((item, index) => (
                      <li className="list-inline-item" key={index}>
                        <Link
                          onClick={() => isActive("color", index, item)}
                          className={`tag ${
                            activeColor === index ? "active" : ""
                          }`}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex align-items-center mt-3">
                  <QuantityBox onQuantityChange={onQuantityChange} />
                  <Button
                    onClick={() => addCart(id)}
                    className="d-flex align-items-center btn-cart ml-3 btn-blue btn-lg text-capitalize btn-big btn-round"
                  >
                    {loadingCart === true ? (
                      <CircularProgress className="" />
                    ) : (
                      <>
                        <BsCartPlusFill />
                        &nbsp; Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                  <Tooltip title="Add to Wishlist" placement="top">
                    <Button className="btn-blue btn-lg btn-circle ml-3">
                      <FaRegHeart />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Compare" placement="top">
                    <Button className="btn-blue btn-lg btn-circle ml-3">
                      <MdOutlineCompareArrows />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
            <br />
            <div className="card mt-5 detailsPageTabs">
              <div className="customTabs">
                <ul className="list list-inline">
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 0 && "active"}`}
                      onClick={() => isActive("tab", 0)}
                    >
                      Mô tả
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 1 && "active"}`}
                      onClick={() => isActive("tab", 1)}
                    >
                      Thông tin thêm
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 2 && "active"}`}
                      onClick={() => isActive("tab", 2)}
                    >
                      Đánh giá sản phẩm
                    </Button>
                  </li>
                </ul>
                <br />

                {activeTabs === 0 && (
                  <div className="tabContent">
                    {product?.product?.description}
                  </div>
                )}

                {activeTabs === 1 && (
                  <div className="tabContent">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTabs === 2 && (
                  <div className="tabContent">
                    <div className="row">
                      <div className="col-md-8">
                        <h3>Customer questions & answers</h3>
                        <br />
                        <div className="reviewBox mb-4 border-bottom">
                          <div className="info">
                            <div className="d-flex align-items-center w-100">
                              <h5>Tajiro</h5>
                              <div className="ml-auto">
                                <Rating
                                  name="read-only"
                                  value={4.5}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                              </div>
                            </div>
                            <h6 className="text-gray">2024-10-06</h6>
                            <p>Good!</p>
                          </div>
                        </div>
                        <div className="reviewBox mb-4 border-bottom">
                          <div className="info">
                            <div className="d-flex align-items-center w-100">
                              <h5>Tajiro</h5>
                              <div className="ml-auto">
                                <Rating
                                  name="read-only"
                                  value={4.5}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                              </div>
                            </div>
                            <h6 className="text-gray">2024-10-06</h6>
                            <p>Good!</p>
                          </div>
                        </div>
                        <div className="reviewBox mb-4 border-bottom">
                          <div className="info">
                            <div className="d-flex align-items-center w-100">
                              <h5>Tajiro</h5>
                              <div className="ml-auto">
                                <Rating
                                  name="read-only"
                                  value={4.5}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                              </div>
                            </div>
                            <h6 className="text-gray">2024-10-06</h6>
                            <p>Good!</p>
                          </div>
                        </div>
                        <div className="reviewBox mb-4 border-bottom">
                          <div className="info">
                            <div className="d-flex align-items-center w-100">
                              <h5>Tajiro</h5>
                              <div className="ml-auto">
                                <Rating
                                  name="read-only"
                                  value={4.5}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                              </div>
                            </div>
                            <h6 className="text-gray">2024-10-06</h6>
                            <p>Good!</p>
                          </div>
                        </div>

                        <form className="reviewForm">
                          <h4>Your Review Here!</h4>
                          <div className="form-group">
                            <textarea
                              className="form-control shadow"
                              placeholder="Write a Review"
                              name="review"
                            ></textarea>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <Rating
                                  name="simple-controlled"
                                  precision={0.5}
                                  value={valueRating}
                                  onChange={(event, newValue) => {
                                    setValueRating(newValue);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <Button className="btn-blue btn-lg btn-big btn-round ">
                              Send Your Review
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex mt-5 align-items-center productSize">
              <span>Tags: </span>
              <ul className="list list-inline mb-0 pl-4">
                {product?.product?.tags?.map((item, index) => (
                  <li className="list-inline-item" key={index}>
                    <Link
                      onClick={() => isActive("tag", index, item)}
                      className={`tag ${activeTag === index ? "active" : ""}`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {relatedProducts?.length !== 0 ? (
              <RelatedProducts
                title="Sản phẩm liên quan"
                data={relatedProducts}
              />
            ) : (
              <p>Không có sản phẩm liên quan</p>
            )}

            {/* <RelatedProducts title="RECENTLY VIEW PRODUCTS" /> */}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
