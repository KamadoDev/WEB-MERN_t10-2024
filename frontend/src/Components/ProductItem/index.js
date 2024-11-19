import React, { useContext } from "react";

import Button from "@mui/material/Button";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
// import required modules
import { Rating } from "@mui/material";
import { MyContext } from "../../App";
import { useEffect } from "react";

const ProductItem = (props) => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setisOpenProductModal({
      id: id,
      open: true,
    });
  };

  useEffect(() => {
    console.log(props.item);
  }, [props.item]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div className={`item productItem ${props.itemView}`}>
        <Link to={`/product/${props.item?.id}`}>
          <div className="imgWrapper" style={{ width: "100%" }}>
            <img
              className="w-100"
              src={props.item?.images[0].url}
              alt={props.item?.name?.substr(0, 19) + "..."}
              style={{ height: "250px" }}
            />

            {props.item?.discount > 0 && (
              <span className="badge badge-danger">
                Giảm {props.item?.discount}%
              </span>
            )}
            <div className="actions">
              <Button onClick={() => viewProductDetails(props.item?.id)}>
                <TfiFullscreen />
              </Button>
              <Button>
                <IoMdHeartEmpty style={{ fontSize: "20px" }} />
              </Button>
            </div>
          </div>
        </Link>

        <div className="info">
          <Link to={`/product/${props.item?._id}`}>
            <h4>{props.item?.name?.substr(0, 19) + "..."}</h4>
          </Link>
          <span className="text-success d-block">
            {props.item?.productInStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={props.item?.rating}
            readOnly
            size="small"
            precision={0.5}
          />

          <div className="d-flex">
            {props.item?.old_price < props.item?.price ? (
              <span className="newPrice text-danger ml-2">
                {formatCurrency(props.item?.price)}
              </span>
            ) : (
              <>
                <span className="oldPrice">
                  {formatCurrency(props.item?.old_price)}
                </span>
                <span className="newPrice text-danger ml-2">
                  {formatCurrency(props.item?.price)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
