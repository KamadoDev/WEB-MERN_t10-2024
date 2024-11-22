import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Components/Footer";
import ProductModal from "./Components/ProductModal";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import AuthSignIn from "./Pages/AuthSignIn";
import AuthSignUp from "./Pages/AuthSignUp";
import { getData } from "./utils/api";

const MyContext = createContext();
function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isOpenProductModal, setisOpenProductModal] = useState({
    id: "",
    open: false,
  });
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [alertBox, setAlertBox] = useState({
    open: false,
    message: "",
    type: "",
  });

  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    userId: "",
    avatar: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      setIsLogin(true);
      const userFromLocalStorage = localStorage.getItem("user");
      const userFromSessionStorage = sessionStorage.getItem("user");

      const user = userFromLocalStorage
        ? JSON.parse(userFromLocalStorage)
        : userFromSessionStorage
        ? JSON.parse(userFromSessionStorage)
        : null;
      setUserData(user);
    } else {
      setIsLogin(false);
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    getCountry("https://countriesnow.space/api/v0.1/countries");

    getData("/api/category").then((data) => {
      console.log(data);
      setCategoryData(data.categories);
      setLoading(false);
    });

    getData("/api/subcategory").then((data) => {
      console.log(data);
      setSubCategoryData(data.subcategories);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    isOpenProductModal.open === true &&
      getData(`/api/products/${isOpenProductModal.id}`).then((data) => {
        console.log(data);
        setProductData(data);
        setLoading(false);
      });
  }, [isOpenProductModal]);

  const getCountry = async (url) => {
    await axios.get(url).then((res) => {
      setCountryList(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          console.error("Token không tồn tại.");
          return;
        }
        const response = await getData(`/api/cart/getCart/${userData.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dữ liệu giỏ hàng:", response);
        setCartData(response); // Cập nhật dữ liệu giỏ hàng
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, [userData.userId]);

  const values = {
    countryList,
    setSelectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,
    loading,
    setLoading,
    userData,
    setUserData,
    cartData,
    setCartData,
    alertBox,
    setAlertBox,
  };
  return (
    <MyContext.Provider value={values}>
      {isHeaderFooterShow === true && <Header />}
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/cat/:id" exact={true} element={<Listing />} />
        <Route path="/product/:id" exact={true} element={<ProductDetails />} />
        <Route path="/cart" exact={true} element={<Cart />} />
        <Route path="/signIn" exact={true} element={<AuthSignIn />} />
        <Route path="/signUp" exact={true} element={<AuthSignUp />} />
      </Routes>
      {isHeaderFooterShow === true && <Footer />}
      {isOpenProductModal.open === true && <ProductModal data={productData} />}
    </MyContext.Provider>
  );
}

export default App;

export { MyContext };
