import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  allUsersCount: 0,
  subscribedUsersCount: 0,
};

export const getStatsData = createAsyncThunk("getstat", async () => {
  try {
    const res = await axiosInstance.get("/admin/stats/users");
    toast.promise(Promise.resolve(res), {
      loading: "Getting the stats...",
      success: (data) => data?.data?.message,
      error: "Failed to load stats",
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch stats");
    throw error;
  }
});


const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      state.allUsersCount = action?.payload?.allUsersCount;
      state.subscribedUsersCount = action?.payload?.subscribedUsersCount;
    });
    builder.addCase(getStatsData.rejected, (state) => {
      state.allUsersCount = 0;
      state.subscribedUsersCount = 0;
    });
  },
});

export default statSlice.reducer;
