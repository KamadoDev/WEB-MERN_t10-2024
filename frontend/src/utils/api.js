import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

// ⚙️ Cấu hình mặc định toàn cục cho axios
axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true; // ✅ Gửi cookie (token) tự động trong mọi request

// -----------------------------
// 📦 GET
// -----------------------------
export const getData = async (url, options = {}) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true, // ✅ gửi cookie
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};

// -----------------------------
// 📦 POST
// -----------------------------
export const postData = async (url, formData, options = {}) => {
  try {
    const headers = options.headers || {};
    if (!options.hasFile) headers["Content-Type"] = "application/json";

    const response = await axios.post(url, formData, {
      ...options,
      withCredentials: true, // ✅ cookie gửi kèm
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error posting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};

// -----------------------------
// 📦 PUT (Update 1 item)
// -----------------------------
export const putDataOne = async (url, formData, options = {}) => {
  try {
    const headers = options.headers || {};
    if (!options.hasFile) headers["Content-Type"] = "application/json";

    const response = await axios.put(url, formData, {
      ...options,
      withCredentials: true, // ✅ gửi cookie
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error putting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};

// -----------------------------
// 📦 PUT (Update general)
// -----------------------------
export const putData = async (url, formData, options = {}) => {
  try {
    const headers = options.headers || {};
    headers["Content-Type"] = options.hasFile
      ? "multipart/form-data"
      : "application/json";

    const response = await axios.put(url, formData, {
      ...options,
      withCredentials: true, // ✅ gửi cookie
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error putting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};

// -----------------------------
// 📦 DELETE
// -----------------------------
export const deleteData = async (url, data = null, options = {}) => {
  try {
    const config = {
      withCredentials: true, // ✅ gửi cookie
      ...options,
      headers: options.headers || {},
    };

    if (data) config.data = data;

    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
};
