// src/api/axiosClient.js
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
});

// Attach JWT token from either localStorage or sessionStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token =
        localStorage.getItem("finsight_token") ||
        sessionStorage.getItem("finsight_token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error reading token from storage:", err);
    }
  }
  return config;
});

export default api;
