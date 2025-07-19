import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from '../../config/axiosInstance'
// to maintain the old state
const initialState = {
    isLoggedIn : localStorage.getItem("isLoggedIn") || false,
    data: JSON.parse(localStorage.getItem("data")) || {},
    role: localStorage.getItem("role") || "",
}

// using async thunk
// sign up
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const response = axiosInstance.post("user/register", data);
        
        toast.promise(response, {
            loading: 'Wait! creating your account',
            success: (data)=> {
                return data?.data?.message;
            },
            error: 'Failed to create your account'
        });

        return await response;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

//signin
export const login = createAsyncThunk("/auth/signin", async (data) => {
    try {
        const response = axiosInstance.post("user/login", data);
        
        toast.promise(response, {
            loading: 'Wait! authenticating your account',
            success: (data)=> {
                return data?.data?.message;
            },
            error: 'Failed to authenticate your account'
        });

        return await response;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

//logout
export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const response = axiosInstance.post("user/logout");
        toast.promise(response, {
            loading: 'Wait! logging out your account',
            success: (data)=> {
                return data?.data?.message;
            },
            error: 'Failed to logout your account'
        });
        return await response;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

// get user details
export const getUserData = createAsyncThunk("/auth/details", async () => {
    try {
        const response = axiosInstance.get("/user/me");
        return (await response).data;
    } catch (error) {
        toast.error(error?.message);
    }
});


// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);


// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to update user profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`/user/update/${data[0]}`, data[1]);

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.data))
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem("role", action?.payload?.data?.user?.role);

            state.isLoggedIn = true;
            state.role = action?.payload?.data?.user?.role;
            state.data = action?.payload?.data?.user;
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.role = "";
            state.data = {};
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            
            if(!action?.payload?.user) return;

            localStorage.setItem("data", JSON.stringify(action?.payload?.user))
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem("role", action?.payload?.user?.role);
            
            state.isLoggedIn = true;
            state.role = action?.payload?.user?.role;
            state.data = action?.payload?.user;
        })
    }
});

export const {} = authSlice.actions;
export default authSlice.reducer;


