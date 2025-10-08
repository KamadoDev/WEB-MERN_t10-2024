import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { postData } from "./api"; // Giả định postData nằm trong src/utils/api
import { firebaseApp } from "../firebase"; // Import instance Firebase app

// Cấu hình các hằng số cần thiết cho Firebase Auth
const provider = new GoogleAuthProvider();
// Lấy đối tượng Auth từ Firebase app instance
const auth = getAuth(firebaseApp);

/**
 * Xử lý quá trình đăng nhập/đăng ký bằng Google.
 * @param {object} context - Đối tượng context từ React (chứa setisHeaderFooterShow).
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
      fullName: user.displayName, // Đã có sẵn trong user object
      email: user.email,         // Đã có sẵn trong user object
      images: user.photoURL,     // Đã có sẵn trong user object
    };
    
    // 3. Send user data to your backend (Backend sẽ xử lý đăng nhập hoặc đăng ký)
    const response = await postData(`/api/user/authWithGoogle`, fields);

    // 4. Handle successful response
    if (response.success === true) {
      // Lưu token và chi tiết người dùng
      localStorage.setItem("token", response.token);
      const userData = {
        userId: response.user?._id,
        username: response.user?.username,
        email: response.user?.email,
        fullName: response.user?.fullName,
        phone: response.user?.phone,
        avatar: response.user?.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      
      setAlertBox({
        open: true,
        closing: false,
        status: "success",
        message: response.message,
      });

      // Chuyển hướng sau khi đăng nhập thành công
      setTimeout(() => {
        context.setisHeaderFooterShow(true);
        history("/");
      }, 1000);
    } else {
      // Xử lý lỗi từ Backend
      console.error("Authentication failed:", response.message);
      setAlertBox({
        open: true,
        closing: false,
        status: "error",
        message: response.message,
      });
    }
  } catch (error) {
    // Xử lý lỗi Firebase hoặc lỗi mạng
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error(`Error during Google sign-in: ${errorCode} - ${errorMessage}`);
    
    // Hiển thị lỗi ra AlertBox
    setAlertBox({
      open: true,
      closing: false,
      status: "error",
      message: `Lỗi xác thực Google: ${errorMessage}`,
    });
  }
};
