import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { postData } from "./api"; // Giả định postData nằm trong src/utils/api
import { firebaseApp } from "../firebase"; // Import instance Firebase app

// Cấu hình các hằng số cần thiết cho Firebase Auth
const provider = new GoogleAuthProvider();
// Lấy đối tượng Auth từ Firebase app instance
const auth = getAuth(firebaseApp);

/**
 * Xử lý quá trình đăng nhập/đăng ký bằng Google.
 * @param {object} context - Đối tượng context từ React (chứa setisHeaderFooterShow và setIsLogin).
 * @param {function} history - Hàm navigate của react-router-dom.
 * @param {function} setAlertBox - Hàm để cập nhật trạng thái AlertBox.
 */
export const handleGoogleSignIn = async (context, history, setAlertBox) => {
    try {
        // 1. Trigger Google sign-in popup
        const result = await signInWithPopup(auth, provider);

        // 2. Extract user data for backend
        const user = result.user;
        const fields = {
            fullName: user.displayName, 
            email: user.email, 
            images: user.photoURL, 
        };
        
        // 3. Send user data to your backend (Backend sẽ xử lý đăng nhập/đăng ký và đặt Cookie)
        const response = await postData(`/api/user/authWithGoogle`, fields);

        // 4. Handle successful response
        if (response.success === true) {
            
            // ✅ LOẠI BỎ LƯU TOKEN VÌ TOKEN ĐƯỢC XỬ LÝ QUA COOKIE
            // (localStorage.setItem("token", response.token); đã bị xóa)
            
            const userData = {
                userId: response.user?._id,
                username: response.user?.username,
                email: response.user?.email,
                fullName: response.user?.fullName,
                phone: response.user?.phone,
                avatar: response.user?.avatar,
            };
            
            // ✅ LƯU TRỮ USER DATA VÀO SESSION STORAGE (Nhất quán với App.js)
            sessionStorage.setItem("user", JSON.stringify(userData));
            
            // ✅ Cập nhật trạng thái Login ngay lập tức
            context.setIsLogin(true);
            
            setAlertBox({
                open: true,
                // Bỏ closing: false vì thường không cần thiết
                status: "success",
                message: response.message,
            });

            // Chuyển hướng sau khi đăng nhập thành công
            setTimeout(() => {
                context.setisHeaderFooterShow(true); // Đảm bảo hiển thị header/footer
                history("/"); // history là hàm navigate
            }, 1000);
            
        } else {
            // Xử lý lỗi từ Backend
            console.error("Authentication failed:", response.message);
            setAlertBox({
                open: true,
                status: "error",
                message: response.message,
            });
        }
    } catch (error) {
        // Xử lý lỗi Firebase (hủy bỏ, mạng, v.v.)
        const errorMessage = error.message;

        // Chỉ hiển thị lỗi nếu không phải do người dùng tự đóng popup
        if (error.code !== 'auth/popup-closed-by-user') { 
            console.error(`Error during Google sign-in: ${errorMessage}`);
            
            setAlertBox({
                open: true,
                status: "error",
                message: `Lỗi xác thực Google: Vui lòng thử lại.`,
            });
        }
    }
};