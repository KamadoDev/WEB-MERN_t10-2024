import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
console.log("hihi", baseUrl);

export const getData = async (url, options = {}) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, options); // Truyền toàn bộ options
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data; // Trả về lỗi từ server nếu có
    }
    return { status: false, message: "Network error" }; // Trường hợp lỗi mạng hoặc lỗi không xác định
  }
};

export const postData = async (url, formData, options = {}) => {
  try {
    // Mặc định headers
    const headers = options.headers || {};
    if (!options.hasFile) {
      headers["Content-Type"] = "application/json";
    }

    // Gửi request với Axios
    const response = await axios.post(`${baseUrl}${url}`, formData, {
      ...options, // Gộp các tùy chọn khác, bao gồm headers
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error posting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data; // Trả về lỗi từ server
    }
    return { status: false, message: "Network error" }; // Lỗi mạng hoặc lỗi không xác định
  }
};

export const putData = async (url, formData, options = {}) => {
  try {
    // Mặc định headers
    const headers = options.headers || {};
    if (!options.hasFile) {
      headers["Content-Type"] = "application/json";
    }

    // Gửi request với Axios
    const response = await axios.put(`${baseUrl}${url}`, formData, {
      ...options, // Gộp các tùy chọn khác, bao gồm headers
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error put data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data; // Trả về lỗi từ server
    }
    return { status: false, message: "Network error" }; // Lỗi mạng hoặc lỗi không xác định
  }
};

export const deleteData = async (url, data = null, options = {}) => {
  try {
    const headers = options.headers || {};

    // Thiết lập config cho axios.delete
    const config = {
      ...options,
      headers,
    };

    // Nếu có `data`, thêm vào config
    if (data) {
      config.data = data;
    }

    // Gửi request DELETE với config
    const response = await axios.delete(`${baseUrl}${url}`, config);

    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data; // Trả về lỗi từ server nếu có
    }
    return { status: false, message: "Network error" }; // Lỗi mạng hoặc không xác định
  }
};
