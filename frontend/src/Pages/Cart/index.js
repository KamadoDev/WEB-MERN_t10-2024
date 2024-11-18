import { Button, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import QuantityBox from "../../Components/QuantityBox";
import { GoTrash } from "react-icons/go";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
const Cart = () => {
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd text-capitalize">Your Cart</h2>
          <p>
            There are <span>3</span> products in your cart
          </p>
          <div className="row">
            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table text-left">
                  <thead>
                    <tr>
                      <th with="45%">Product</th>
                      <th with="15%">Unit Price</th>
                      <th with="20%">Quantity</th>
                      <th with="15%">Subtotal</th>
                      <th with="10%">remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td width="45%">
                        <Link to="">
                          <div className="d-flex align-items-center cartItemImg">
                            <div className="imgWrapper">
                              <img
                                className="w-100"
                                src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1729065985/1729065982783_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvotwal6de-0-202404071601.webp"
                                alt=""
                              />
                            </div>
                            <div className="info px-3">
                              <h6 className="text-ellipsis">
                                Deel Band Women Rayon Embroide
                              </h6>
                              <Rating
                                name="read-only"
                                value={4.5}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="15%">$130</td>
                      <td width="20%">
                        <QuantityBox />
                      </td>
                      <td width="15%">$130</td>
                      <td className="remove" width="10%">
                        <GoTrash />
                      </td>
                    </tr>
                    <tr>
                      <td width="45%">
                        <Link to="">
                          <div className="d-flex align-items-center cartItemImg">
                            <div className="imgWrapper">
                              <img
                                className="w-100"
                                src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1729065985/1729065982783_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvotwal6de-0-202404071601.webp"
                                alt=""
                              />
                            </div>
                            <div className="info px-3">
                              <h6 className="text-ellipsis">
                                Deel Band Women Rayon Embroide
                              </h6>
                              <Rating
                                name="read-only"
                                value={4.5}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="15%">$130</td>
                      <td width="20%">
                        <QuantityBox />
                      </td>
                      <td width="15%">$130</td>
                      <td className="remove" width="10%">
                        <GoTrash />
                      </td>
                    </tr>
                    <tr>
                      <td width="45%">
                        <Link to="">
                          <div className="d-flex align-items-center cartItemImg">
                            <div className="imgWrapper">
                              <img
                                className="w-100"
                                src="https://res.cloudinary.com/dy2p0n2xc/image/upload/v1729065985/1729065982783_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvotwal6de-0-202404071601.webp"
                                alt=""
                              />
                            </div>
                            <div className="info px-3">
                              <h6 className="text-ellipsis">
                                Deel Band Women Rayon Embroide
                              </h6>
                              <Rating
                                name="read-only"
                                value={4.5}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="15%">$130</td>
                      <td width="20%">
                        <QuantityBox />
                      </td>
                      <td width="15%">$130</td>
                      <td className="remove" width="10%">
                        <GoTrash />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 cartDetails">
                <h4 className="text-center text-uppercase mb-3">Cart Total</h4>
                <div className="d-flex align-items-center mb-3">
                  <span>Subtotal</span>
                  <span className="priceCart ml-auto font-weight-bold">
                    4,500.00
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Shipping</span>
                  <span className="ml-auto">
                    <b>Free</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto">
                    <b>United Kingdom</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Voucher</span>
                  <div className="discountCode ml-auto">
                    <div className="iconDiscount">
                      <BiSolidDiscount />
                    </div>
                    <input
                      type="text"
                      id="discount-code"
                      className="input-discount form-control mr-2"
                      placeholder="Enter your code"
                    />
                    <p className="checkCode error">Valid code</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Total</span>
                  <span className="priceCart ml-auto font-weight-bold">
                    4,500.00
                  </span>
                </div>
                <Link to="">
                  <Button className="btn-blue text-capitalize bg-red btn-lg btn-big btnCheckout">
                    <MdOutlineShoppingCartCheckout />
                    Checkout
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
