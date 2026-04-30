import axios from "axios";
import store from "../redux/store";
import { setAccessToken, clearAuth } from "../redux/slices/authSlice";
import * as authApi from "./auth.api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies
});

// Request interceptor - Add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const response = await authApi.refreshAccessToken();
        const newAccessToken = response.data.accessToken;

        // Update Redux store with new token
        store.dispatch(setAccessToken(newAccessToken));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        store.dispatch(clearAuth());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
