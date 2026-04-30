import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user and token after login/signup
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.error = null;
    },

    // Set access token after refresh
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Logout
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
  },
});

export const { setAuth, setAccessToken, setLoading, setError, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
