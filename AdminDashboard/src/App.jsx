import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import ProductsList from "./components/Products/ProductsList";
import ProductCreate from "./components/Products/ProductCreate";
import SignIn from "./components/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OPTpage from "./pages/OTP/OTPpage";
import ProductsLayout from "./Layouts/Products/ProductsLayout";
import AuthLayout from "./Layouts/Auth/AuthLayout";
import CategoriesLayout from "./Layouts/Categories/CategoriesLayout";
import CategoryList from "./components/Category/CategoryList";
import CategoryCreate from "./components/Category/CategoryCreate";
import SubCategoryCreate from "./components/SubCategory/SubCategoryCreate";
import SubCategoryList from "./components/SubCategory/SubCategoryList";
const MyContext = createContext();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(false);
  const [openDraw, setOpenDraw] = useState(false);
  const [Message, setMessage] = useState("");
  const [TypeMessage, setTypeMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setTimeout(() => {
      setOpen(false);
    }, 5000);
  };

  useEffect(() => {
    if (open === true) {
      handleOpenModal();
    }
  }, [open]);

  const values = {
    isLogin,
    setIsLogin,
    isShowHeaderFooter,
    setIsShowHeaderFooter,
    openDraw,
    setOpenDraw,
    setMessage,
    Message,
    setTypeMessage,
    TypeMessage,
    setOpen,
    open,
  };

  return (
    <MyContext.Provider value={values}>
      <BrowserRouter>
        <section className="main flex">
          {isShowHeaderFooter === false && (
            <div className="sidebarWrapper w-[15%]">
              <Sidebar />
            </div>
          )}
          <div
            className={` ${
              isShowHeaderFooter === true
                ? "w-[100%]"
                : "content_right w-[85%] px-3"
            } `}
          >
            {isShowHeaderFooter === false && (
              <>
                <Header />
                <div className="space"></div>
              </>
            )}

            <Routes>
              <Route path="/" exact={true} element={<Dashboard />} />
              {/* Product */}
              <Route path="/products" element={<ProductsLayout />}>
                <Route
                  path="list"
                  element={<ProductsList title="Danh sách" />}
                />
                <Route path="create" element={<ProductCreate />} />
              </Route>
              <Route path="/category" element={<CategoriesLayout />}>
                <Route
                  path="list"
                  element={<CategoryList title="Danh sách" />}
                />
                <Route path="create" element={<CategoryCreate />} />
              </Route>
              <Route path="/subcategory" element={<CategoriesLayout />}>
                <Route
                  path="list"
                  element={<SubCategoryList title="Danh sách" />}
                />
                <Route path="create" element={<SubCategoryCreate />} />
              </Route>
              <Route path="/authen" element={<AuthLayout />}>
                <Route path="login" element={<SignIn />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="otp" element={<OPTpage />} />
              </Route>
            </Routes>
          </div>
        </section>
      </BrowserRouter>
    </MyContext.Provider>
  );
};

export default App;

export { MyContext };
