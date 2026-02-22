// src/clinic/Services/adminAxios.js
import axios from "axios";

const adminAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  withCredentials: true, // 🔐 IMPORTANT: send cookies automatically
});

// Response interceptor
adminAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    // If not authenticated → redirect to login
    if (err.response?.status === 401) {
      window.location.href = "/clinic/login";
    }
    return Promise.reject(err);
  }
);

export default adminAxios;
