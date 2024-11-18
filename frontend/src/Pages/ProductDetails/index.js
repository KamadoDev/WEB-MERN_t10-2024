import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { Button } from "@mui/material";
import { BsCartPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ProductItemSlide from "../../Components/ProductItemSlide";
import RelatedProducts from "../../Components/RelatedProducts";

const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [valueRating, setValueRating] = useState(5);

  const isActive = (index) => {
    setActiveSize(index);
  };
  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pl-5">
              <ProductZoom />
            </div>
            <div className="col-md-8 pl-5 pr-5">
              <h2 className="hd text-capitalize">
                GESPO Peach Solid Mandarin Collar Half Sleeve Casual T-Shirt
              </h2>
              <ul className="list list-inline mb-0 d-flex align-items-center">
                <li className="list-inline-item ">
                  <div className="d-flex align-items-center ">
                    <span className="text-gray mr-2">Brands:</span>
                    <span className="text-drak">Apple</span>
                  </div>
                </li>
                <li className="list-inline-item ">
                  <div className="d-flex align-items-center">
                    <Rating
                      name="read-only"
                      value={5}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                    <span className="text-gray text-capitalize ml-2">
                      {" "}
                      1 Review
                    </span>
                  </div>
                </li>
              </ul>
              <div className="d-flex mb-3">
                <span className="oldPrice">$20.00</span>
                <span className="newPrice text-danger ml-2">$14.00</span>
              </div>
              <span class="badge badge-span bg-success text-white">
                In Stock
              </span>

              <p className="mt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                cursus, orci sed condimentum facilisis, justo neque cursus
                velit, in elementum mauris nunc vitae neque. Quisque non
                condimentum consectetur dolor. Sed faucibus, purus at maximus
                fermentum, justo nunc lobortis tellus, et efficitur est lectus
                ut justo.
              </p>

              <div className="d-flex align-items-center productSize">
                <span>Size / Weight:</span>
                <ul className="list list-inline mb-0 pl-4 ">
                  <li className="list-inline-item">
                    <Link
                      onClick={() => isActive(0)}
                      className={`tag ${activeSize === 0 ? "active" : ""}`}
                    >
                      50g
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      onClick={() => isActive(1)}
                      className={`tag ${activeSize === 1 ? "active" : ""}`}
                    >
                      50g
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      onClick={() => isActive(2)}
                      className={`tag ${activeSize === 2 ? "active" : ""}`}
                    >
                      50g
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      onClick={() => isActive(3)}
                      className={`tag ${activeSize === 3 ? "active" : ""}`}
                    >
                      50g
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="d-flex align-items-center mt-3">
                <QuantityBox />
                <Button className="d-flex align-items-center btn-cart ml-3 btn-blue btn-lg text-capitalize btn-big btn-round">
                  <BsCartPlusFill />
                  &nbsp; Add to cart
                </Button>
                <Tooltip title="Add to Wishlist" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-3">
                    <FaRegHeart />
                  </Button>
                </Tooltip>
                <Tooltip title="Compare" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-3">
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
                    onClick={() => setActiveTabs(0)}
                  >
                    Description
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && "active"}`}
                    onClick={() => setActiveTabs(1)}
                  >
                    Additional info
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 && "active"}`}
                    onClick={() => setActiveTabs(2)}
                  >
                    Reviews
                  </Button>
                </li>
              </ul>
              <br />

              {activeTabs === 0 && (
                <div className="tabContent">
                  <p>
                    Description: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed
                  </p>
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

          <RelatedProducts title="RELATED PRODUCTS"/>

          <RelatedProducts title="RECENTLY VIEW PRODUCTS"/>
          
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
