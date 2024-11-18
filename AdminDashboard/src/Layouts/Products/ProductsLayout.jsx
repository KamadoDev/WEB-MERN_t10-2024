import { Outlet } from "react-router-dom";

const ProductsLayout = () => {
  return (
    <>
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default ProductsLayout;
