import { Outlet } from "react-router-dom";

const CategoriesLayout = () => {
  return (
    <>
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default CategoriesLayout;
