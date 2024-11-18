import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
console.log("hihi", baseUrl);

export const getData = async (url, id) => {
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const postData = async (url, formData, hasFile = false) => {
  try {
    const headers = hasFile ? {} : { "Content-Type": "application/json" };
    const response = await axios.post(`${baseUrl}${url}`, formData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const putData = async (url, formData) => {
  try {
    const response = await axios.put(`${baseUrl}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const deleteData = async (url, id) => {
  try {
    const response = await axios.delete(`${baseUrl}${url}/${id}`);
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
