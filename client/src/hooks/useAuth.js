import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAuth,
  setLoading,
  setError,
  clearAuth,
} from "../redux/slices/authSlice";
import * as authApi from "../api/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, accessToken, isLoading, error } = useSelector(
    (state) => state.auth,
  );

  const signup = async (userData) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.signup(userData);
      dispatch(setAuth(response.data));
      navigate("/dashboard");
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.login(credentials);
      dispatch(setAuth(response.data));
      navigate("/dashboard");
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      dispatch(clearAuth());
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return {
    user,
    accessToken,
    isLoading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };
};
