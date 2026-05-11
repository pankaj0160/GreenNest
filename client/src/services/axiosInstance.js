/**
 * axiosInstance.js
 * Pre-configured Axios instance used for ALL API calls in the app.
 *
 * Why a custom instance?
 * - Sets base URL from environment once — no repetition across services.
 * - withCredentials: true ensures cookies (JWT) are sent on every request.
 * - Request interceptor: attaches Authorization header if a token exists in localStorage.
 * - Response interceptor: globally handles 401 (session expired) by dispatching
 *   a logout action — components don't need to handle this themselves.
 *
 * This instance is imported by all api/*.js service files.
 */

import axios from "axios";
import { store } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // Send cookies on cross-origin requests
  timeout: 15000,        // 15s timeout — prevents hanging requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the JWT Bearer token if present.
// Token is stored in Redux (in-memory) — never in localStorage for security.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401 Unauthorized globally — session expired or token invalid.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired — log the user out so they're redirected to login
      // We check if the request wasn't already a login/auth call to avoid loops
      const requestUrl = error.config?.url || "";
      const isAuthEndpoint = requestUrl.includes("/auth/");

      if (!isAuthEndpoint) {
        store.dispatch(logoutUser());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
