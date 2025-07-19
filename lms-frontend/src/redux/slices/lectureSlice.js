import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  lectures: [],
  loading: false,
  error: null,
};

// Get all lectures for a course
export const getCourseLecture = createAsyncThunk(
  "lecture/getCourseLecture",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await toast.promise(
        axiosInstance.get(`/courses/${courseId}`, {
          withCredentials: true,
        }),
        {
          loading: "Fetching the lectures...",
          success: "Lectures fetched successfully",
          error: "Failed to fetch lectures",
        }
      );

      return res.data.lectures;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch lectures"
      );
    }
  }
);

// Add a new lecture
export const addCourseLecture = createAsyncThunk(
  "lecture/addCourseLecture",
  async ({ id, title, description, lecture }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", lecture); // ✅ MATCHES upload.single('file')

      const res = await toast.promise(
        axiosInstance.post(`/courses/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }),
        {
          loading: "Adding the lecture...",
          success: "Lecture added successfully",
          error: "Failed to add lecture",
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add lecture"
      );
    }
  }
);


// Delete a lecture
export const deleteCourseLecture = createAsyncThunk(
  "lecture/deleteCourseLecture",
  async ({ courseId, lectureId }, { rejectWithValue }) => {
    try {
      await toast.promise(
        axiosInstance.delete(`/courses/${courseId}/lectures/${lectureId}`, {
          withCredentials: true,
        }),
        {
          loading: "Deleting the lecture...",
          success: "Lecture deleted successfully",
          error: "Failed to delete lecture",
        }
      );

      return { lectureId };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete lecture"
      );
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(getCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(addCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = state.lectures.filter(
          (lecture) => lecture._id !== action.payload.lectureId
        );
      })
      .addCase(deleteCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lectureSlice.reducer;
