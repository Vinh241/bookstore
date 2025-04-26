import axios from "axios";

// Tạo instance axios với baseURL trỏ đến backend API
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
