import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  data: JSON.parse(localStorage.getItem("data")) || {},
  role: localStorage.getItem("role") || "",
};

// Signup
export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/user/register", data);
    toast.success(res?.data?.message || "Account created");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed");
    return rejectWithValue(error?.response?.data);
  }
});

// Login
export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/user/login", data);
    toast.success(res?.data?.message || "Login successful");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login failed");
    return rejectWithValue(error?.response?.data);
  }
});

// Logout
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/user/logout");
    toast.success(res?.data?.message || "Logged out successfully");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout failed");
    return rejectWithValue(error?.response?.data);
  }
});

// Get user data
export const getUserData = createAsyncThunk("/user/details", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/user/me");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Could not fetch user data");
    return rejectWithValue(error?.response?.data);
  }
});

export const changePassword = createAsyncThunk("/auth/changePassword", async (userPassword, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/user/change-password", userPassword);
    toast.success(res?.data?.message || "Password changed");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to change password");
    return rejectWithValue(error?.response?.data);
  }
});

export const forgetPassword = createAsyncThunk("auth/forgetPassword", async (email, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/user/reset", { email });
    toast.success(res?.data?.message || "Reset link sent");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to send email");
    return rejectWithValue(error?.response?.data);
  }
});

export const updateProfile = createAsyncThunk("/user/update/profile", async ([id, data], { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/user/update/${id}`, data);
    toast.success(res?.data?.message || "Profile updated");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Update failed");
    return rejectWithValue(error?.response?.data);
  }
});

export const resetPassword = createAsyncThunk("/user/reset", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
    toast.success(res?.data?.message || "Password reset");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Reset failed");
    return rejectWithValue(error?.response?.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const user = action.payload?.user;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", user?.role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const user = action.payload?.user;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", user?.role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role;
      });
  },
});

export default authSlice.reducer;
