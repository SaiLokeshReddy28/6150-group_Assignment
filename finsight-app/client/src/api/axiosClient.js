// src/api/axiosClient.js
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5001/api";

const api = axios.create({
  baseURL,
  timeout: 60000, // AI parsing / uploads can take longer
});

// Attach JWT token from either localStorage or sessionStorage
api.interceptors.request.use((config) => {
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
  return config;
});

export default api;
