import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import ProductsList from "./components/Products/ProductsList";
import ProductCreate from "./components/Products/ProductCreate";
import SignIn from "./components/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OPTpage from "./pages/OTP/OTPpage";
import CategoryList from "./components/Category/CategoryList";
import CategoryCreate from "./components/Category/CategoryCreate";
import SubCategoryCreate from "./components/SubCategory/SubCategoryCreate";
import SubCategoryList from "./components/SubCategory/SubCategoryList";
import Layout from "./Layouts/Layout";
import VoucherCreate from "./components/Voucher/VoucherCreate";
import VoucherList from "./components/Voucher/VoucherList";
import SlideBannerCreate from "./components/SlideBanner/SlideBannerCreate";
import UserList from "./components/User/UserList";
import ProductDetail from "./components/Products/ProductDetail";
import ContactList from "./components/Contact/ContactList";
import OrderList from "./components/Order/OrderList";
import LogoWebList from "./components/LogoWeb/LogoWebList";
const MyContext = createContext();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isShowHeaderFooter, setIsShowHeaderFooter] = useState(false);
  const [openDraw, setOpenDraw] = useState(false);
  const [Message, setMessage] = useState("");
  const [TypeMessage, setTypeMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    userId: "",
    avatar: "",
    role: "",
  });
  const navigate = useNavigate();



  useEffect(() => {
    // KHÔNG CẦN KIỂM TRA TOKEN TRONG LOCAL STORAGE NỮA
    const userFromLocalStorage = localStorage.getItem("user");
    const userFromSessionStorage = sessionStorage.getItem("user");

    let user = null;

    if (userFromLocalStorage) {
      user = JSON.parse(userFromLocalStorage);
    } else if (userFromSessionStorage) {
      user = JSON.parse(userFromSessionStorage);
    }

    if (user && user.userId) { // Kiểm tra nếu có thông tin user hợp lệ
      // Đã đăng nhập
      setIsLogin(true);
      setUserData(user);

      // OPTIONAL: Kiểm tra và chuyển hướng nếu không phải admin (nếu cần)
      if (user.role !== "admin") {
          // Nếu đây là trang Admin, có thể chuyển hướng về trang login hoặc trang lỗi
          navigate("/authen/login"); 
      }

    } else {
      // Chưa đăng nhập (Không tìm thấy user data)
      setIsLogin(false);
      // Chỉ chuyển hướng nếu không phải là trang đăng nhập hoặc trang liên quan
      if (!window.location.pathname.startsWith('/authen')) {
        navigate("/authen/login");
      }
    }
  }, [navigate]);

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
    userData,
    setUserData,
  };

  return (
    <MyContext.Provider value={values}>
      <section className="main flex">
        {isShowHeaderFooter === false && (
          <div className="sidebarWrapper w-[15%]">
            <Sidebar />
          </div>
        )}
        <div
          className={` ${isShowHeaderFooter === true
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
            <Route path="/products" element={<Layout />}>
              <Route path="list" element={<ProductsList title="Danh sách" />} />
              <Route path="create" element={<ProductCreate />} />
              <Route path="view/:id" element={<ProductDetail />} />
            </Route>
            <Route path="/category" element={<Layout />}>
              <Route path="list" element={<CategoryList title="Danh sách" />} />
              <Route path="create" element={<CategoryCreate />} />
            </Route>
            <Route path="/logoweb" element={<Layout />}>
              <Route path="list" element={<LogoWebList title="Danh sách" />} />
            </Route>
            <Route path="/contact" element={<Layout />}>
              <Route path="list" element={<ContactList title="Danh sách" />} />
            </Route>
            <Route path="/subcategory" element={<Layout />}>
              <Route
                path="list"
                element={<SubCategoryList title="Danh sách" />}
              />
              <Route path="create" element={<SubCategoryCreate />} />
            </Route>
            <Route path="/authen" element={<Layout />}>
              <Route path="login" element={<SignIn />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="otp" element={<OPTpage />} />
            </Route>

            <Route path="/voucher" element={<Layout />}>
              <Route path="list" element={<VoucherList title="Danh sách" />} />
              <Route path="create" element={<VoucherCreate />} />
            </Route>

            <Route path="/slide" element={<Layout />}>
              <Route
                path="home/create"
                element={<SlideBannerCreate title="Slide Banner Home" />}
              />
            </Route>

            <Route path="/user" element={<Layout />}>
              <Route path="list" element={<UserList title="Danh sách" />} />
            </Route>

            <Route path="/order" element={<Layout />}>
              <Route path="list" element={<OrderList title="Danh sách" />} />
            </Route>
          </Routes>
        </div>
      </section>
    </MyContext.Provider>
  );
};

export default App;

export { MyContext };
