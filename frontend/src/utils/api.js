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

export const deleteData = async (url, data, config) => {
  try {
    const response = await axios.delete(`${baseUrl}${url}`, {
      data, // Truyền productId trong body của DELETE request
      ...config, // Kết hợp với các header (Authorization)
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const deleteImage = async (url, publicId) => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, { publicId });
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};
