import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: { count: 0 }, // initialized with default count
  finalMonths: {},
  monthlySalesRecord: [],
};

// ✅ 1. Get Razorpay Key
export const getRazorPayId = createAsyncThunk("/razorPayId/get", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/payments/razorpay-key");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to load Razorpay key");
  }
});

// ✅ 2. Purchase Course Bundle
export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/payments/subscribe");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Subscription failed");
  }
});

// ✅ 3. Verify Payment
export const verifyUserPayment = createAsyncThunk("/verifyPayment", async (paymentDetail, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/payments/verify", {
      razorpay_payment_id: paymentDetail.razorpay_payment_id,
      razorpay_subscription_id: paymentDetail.razorpay_subscription_id,
      razorpay_signature: paymentDetail.razorpay_signature,
    });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Verification failed");
  }
});

// ✅ 4. Get All Payment Records
export const getPaymentRecord = createAsyncThunk("paymentrecord", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/payments?count=100");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch payment records");
  }
});

// ✅ 5. Cancel Subscription
export const cancelCourseBundle = createAsyncThunk("/cancelCourse", async (_, thunkAPI) => {
  try {
    const resPromise = axiosInstance.post("/payments/unsubscribe");
    toast.promise(resPromise, {
      loading: "Unsubscribing the bundle...",
      success: "Bundle unsubscribed successfully",
      error: "Failed to unsubscribe the bundle",
    });
    const response = await resPromise;
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Unsubscribe failed");
  }
});

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Razorpay Key
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.key || "";
      })
      .addCase(getRazorPayId.rejected, () => {
        toast.error("Failed to get Razorpay key");
      })

      // Purchase
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id || "";
      })
      .addCase(purchaseCourseBundle.rejected, (_, action) => {
        toast.error(action.payload || "Purchase failed");
      })

      // Verify
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.message || "Payment verified");
        state.isPaymentVerified = action?.payload?.success ?? false;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        toast.error(action.payload || "Verification failed");
        state.isPaymentVerified = false;
      })

      // Payment Record
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments || { count: 0 };
        state.finalMonths = action?.payload?.finalMonths || {};
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord || [];
      })
      .addCase(getPaymentRecord.rejected, (_, action) => {
        toast.error(action.payload || "Failed to load payment records");
      })

      // Cancel
      .addCase(cancelCourseBundle.rejected, (_, action) => {
        toast.error(action.payload || "Unsubscription failed");
      });
  },
});

export default razorpaySlice.reducer;
