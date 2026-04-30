import axiosInstance from "./axios";

const AUTH_BASE = "/auth";

// Signup
export const signup = (userData) => {
  return axiosInstance.post(`${AUTH_BASE}/signup`, userData);
};

// Login
export const login = (credentials) => {
  return axiosInstance.post(`${AUTH_BASE}/login`, credentials);
};

// Refresh Token
export const refreshAccessToken = () => {
  return axiosInstance.post(`${AUTH_BASE}/refresh`);
};

// Logout
export const logout = () => {
  return axiosInstance.post(`${AUTH_BASE}/logout`);
};

// Get Current User
export const getCurrentUser = () => {
  return axiosInstance.get(`${AUTH_BASE}/me`);
};
