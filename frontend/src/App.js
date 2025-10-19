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
import ListHeart from "./Pages/ListHeart";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Collapse, IconButton } from "@mui/material";
import Checkout from "./Pages/Checkout";
import MyOrder from "./Pages/MyOrder";
import SearchPage from "./Pages/SearchPage/SearchPage";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Contact from "./Pages/Contact/Contact";

const MyContext = createContext();

function App() {
    // --- Khai báo State ---
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isOpenProductModal, setisOpenProductModal] = useState({
        id: "",
        open: false,
    });
    const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
    const [isLogin, setIsLogin] = useState(false); // Trạng thái Login
    const [productData, setProductData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchData, setSearchData] = useState({
        items: [],
        totalPages: 1,
        totalItems: 0,
    });
    const [checkoutData, setCheckoutCartData] = useState({
        items: [],
        totalPrice: 0,
    });
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

    // --- EFFECT 1: Kiểm tra và tải dữ liệu người dùng khi component mount hoặc isLogin thay đổi ---
    useEffect(() => {
        // Ưu tiên Session Storage (Đăng nhập gần nhất), sau đó Local Storage (Ghi nhớ đăng nhập)
        const userFromSessionStorage = sessionStorage.getItem("user");
        const userFromLocalStorage = localStorage.getItem("user");
        
        const userJson = userFromSessionStorage || userFromLocalStorage;

        let user = null;
        if (userJson) {
            try {
                user = JSON.parse(userJson);
            } catch (e) {
                console.error("Error parsing user data from storage:", e);
                // Xóa dữ liệu lỗi
                sessionStorage.removeItem("user");
                localStorage.removeItem("user");
            }
        }
        
        // --- LOGIC ĐÃ SỬA: Lấy ID từ trường _id (MongoDB) hoặc userId ---
        const activeUserId = user ? (user._id || user.userId) : null;

        // Kiểm tra tính hợp lệ của User
        if (user && activeUserId) { 
            setIsLogin(true);
            // Ánh xạ dữ liệu vào state userData
            setUserData({
                username: user.username || "",
                fullName: user.fullName || "",
                userId: activeUserId, // SỬ DỤNG ID ĐÃ XÁC ĐỊNH
                avatar: user.avatar || "",
            });
        } else {
            setIsLogin(false);
            // Đảm bảo userId luôn rỗng khi không đăng nhập
            setUserData({
                username: "",
                fullName: "",
                userId: "",
                avatar: "",
            });
        }
    }, [isLogin, navigate]); // Thêm isLogin vào dependency để chạy lại khi component con gọi setIsLogin(true)

    // --- EFFECT 2: Tải dữ liệu cơ bản (Quốc gia, Danh mục) ---
    useEffect(() => {
        setLoading(true);
        
        // Hàm tải dữ liệu quốc gia
        const getCountry = async (url) => {
            try {
                const res = await axios.get(url);
                setCountryList(res.data.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách quốc gia:", error);
            }
        };

        getCountry("https://countriesnow.space/api/v0.1/countries");

        // Tải danh mục
        getData("/api/category").then((data) => {
            setCategoryData(data.categories);
            setLoading(false);
        }).catch(err => console.error("Lỗi tải danh mục:", err));

        // Tải danh mục phụ
        getData("/api/subcategory").then((data) => {
            setSubCategoryData(data.subcategories);
        }).catch(err => console.error("Lỗi tải danh mục phụ:", err));

    }, []);

    // --- EFFECT 3: Tải dữ liệu Product Modal ---
    useEffect(() => {
        if (isOpenProductModal.open === true && isOpenProductModal.id) {
            setLoading(true);
            getData(`/api/products/${isOpenProductModal.id}`).then((data) => {
                setProductData(data);
                setLoading(false);
            }).catch(err => {
                console.error("Lỗi tải dữ liệu sản phẩm modal:", err);
                setLoading(false);
            });
        }
    }, [isOpenProductModal]);


    // --- EFFECT 4: Tải dữ liệu Giỏ hàng ---
    useEffect(() => {
        const fetchData = async () => {
            // Chỉ gọi API giỏ hàng khi có userId và người dùng đã đăng nhập
            if (!userData.userId || !isLogin) {
                setCartData([]); // Đảm bảo giỏ hàng rỗng khi chưa đăng nhập
                return;
            }
            
            try {
                // Cookie được gửi tự động (Giả sử axios đã cấu hình withCredentials = true)
                const response = await getData(`/api/cart/getCart/${userData.userId}`);

                if (response && response.success !== false) {
                    setCartData(response); 
                } else {
                    console.error("Lỗi API giỏ hàng hoặc token hết hạn:", response ? response.message : "Response not valid");
                    // Tùy chọn: Xử lý đăng xuất nếu API trả về lỗi 401/lỗi token hết hạn
                    // sessionStorage.removeItem("user");
                    // localStorage.removeItem("user");
                    // setIsLogin(false);
                }
                
            } catch (error) {
                console.error("Lỗi khi gọi API giỏ hàng:", error);
            }
        };
        fetchData();
    }, [userData.userId, isLogin]); // Chạy lại khi userId hoặc trạng thái login thay đổi

    // --- Context Values ---
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
        checkoutData,
        setCheckoutCartData,
        searchData,
        setSearchData,
        searchQuery,
        setSearchQuery,
    };

    // --- Render Component ---
    return (
        <MyContext.Provider value={values}>
            {isHeaderFooterShow === true && <Header />}
            
            {/* Alert Box */}
            <div
                className="position-fixed"
                style={{ right: "20px", top: "230px", zIndex: "100" }}
            >
                {alertBox.open === true && (
                    <Collapse in={alertBox.open}>
                        <Alert
                            severity={alertBox.status} // Sử dụng alertBox.status thay vì alertBox.type
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setAlertBox({
                                            open: false,
                                            // Giữ lại các trường khác nếu cần
                                        });
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {alertBox.message}
                        </Alert>
                    </Collapse>
                )}
            </div>
            
            {/* Routes */}
            <Routes>
                <Route path="/" exact={true} element={<Home />} />
                <Route path="/cat/:id" exact={true} element={<Listing />} />
                <Route path="/list-heart" exact={true} element={<ListHeart />} />
                <Route path="/product/:id" exact={true} element={<ProductDetails />} />
                <Route path="/cart" exact={true} element={<Cart />} />
                <Route path="/signIn" exact={true} element={<AuthSignIn />} />
                <Route path="/signUp" exact={true} element={<AuthSignUp />} />
                <Route path="/checkout" exact={true} element={<Checkout />} />
                <Route path="/my-order" exact={true} element={<MyOrder />} />
                <Route path="/my-account" exact={true} element={<MyAccount />} />
                <Route path="/search" exact={true} element={<SearchPage />} />
                <Route path="/contact" exact={true} element={<Contact />} />
            </Routes>
            
            {isHeaderFooterShow === true && <Footer />}
            {isOpenProductModal.open === true && <ProductModal data={productData} />}
        </MyContext.Provider>
    );
}

export default App;

export { MyContext };
