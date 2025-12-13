// src/api/axiosClient.js
import axios from "axios";

/**
 * Resolve API base URL
 * - Vercel / Prod: VITE_API_BASE_URL=https://finsight-backend-gwci.onrender.com/api
 * - Local fallback: http://localhost:5001/api
 */
const baseURL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api"
).replace(/\/$/, ""); // remove trailing slash

const api = axios.create({
  baseURL,
  timeout: 60000, // AI parsing + uploads can take time
  // Enable cookies ONLY if you explicitly need them.
  // For JWT-in-Authorization flows, keep this false to simplify CORS.
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
});

// Helpful during deployment debugging
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[axiosClient] baseURL:", baseURL);
}

/**
 * Attach JWT token (localStorage / sessionStorage)
 */
api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem("finsight_token") ||
        sessionStorage.getItem("finsight_token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ensure paths remain relative to `${baseURL}/...`
      if (typeof config.url === "string" && config.url.startsWith("/")) {
        config.url = config.url.slice(1);
      }
    } catch (err) {
      console.error("Token read error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Helpful response error logging (DO NOT remove)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("❌ Network / CORS error:", {
        baseURL,
        message: error.message,
      });
    } else {
      console.error("❌ API error:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
