import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as authApi from "../api/auth.api";
import {
  setAuth,
  setAccessToken,
  clearAuth,
  setInitialized,
} from "../redux/slices/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const refreshRes = await authApi.refreshAccessToken();
        const token = refreshRes?.data?.accessToken;

        if (token) {
          dispatch(setAccessToken(token));
          const meRes = await authApi.getCurrentUser();

          if (mounted) {
            dispatch(
              setAuth({
                user: meRes.data.user,
                accessToken: token,
              }),
            );
          }
        } else {
          dispatch(clearAuth());
        }
      } catch {
        dispatch(clearAuth());
      } finally {
        if (mounted) dispatch(setInitialized(true));
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
