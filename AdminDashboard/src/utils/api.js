// api.js - Phiên bản Tối ưu hóa (Clean Code)

import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// ✨ TẠO AXIOS INSTANCE: Áp dụng baseURL và withCredentials một lần
const apiInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true, // Áp dụng cho TẤT CẢ request
});

// ********** HÀM GET **********
export const getData = async (url, id) => {
    try {
        const response = await apiInstance.get(url, { // Chỉ truyền url còn lại do instance lo
            params: { id },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};

// ********** HÀM POST **********
export const postData = async (url, formData, hasFile = false) => {
    try {
        const headers = hasFile
            ? {}
            : { "Content-Type": "application/json" };

        const response = await apiInstance.post(url, formData, { headers });
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};

// ********** HÀM PUT (multipart/form-data) **********
export const putData = async (url, formData) => {
    try {
        const response = await apiInstance.put(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};

// ********** HÀM PUT (application/json) **********
export const putDataJson = async (url, json) => {
    try {
        const response = await apiInstance.put(url, json, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};

// ********** HÀM DELETE (Theo ID trong URL) **********
export const deleteData = async (url, id) => {
    try {
        // Cần truyền đủ cả URL và ID
        const response = await apiInstance.delete(`${url}/${id}`); 
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};

// ********** HÀM DELETE IMAGE (Sử dụng POST với publicId) **********
export const deleteImage = async (url, publicId) => {
    try {
        const response = await apiInstance.post(
            url,
            { publicId }
            // Không cần thêm headers, mặc định là application/json
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error.message);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
};