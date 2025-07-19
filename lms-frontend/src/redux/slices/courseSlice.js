import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  coursesData: [],
};

// function to get all courses
export const getAllCourses = createAsyncThunk("/course/get", async (_, { rejectWithValue }) => {
  try {
    const resPromise = axiosInstance.get("/courses");

    toast.promise(resPromise, {
      loading: "Loading courses data...",
      success: "Courses loaded successfully",
      error: "Failed to get courses",
    });

    const response = await resPromise;
    return response.data.courses;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    return rejectWithValue(error?.response?.data);
  }
});

// function to create a new course
export const createNewCourse = createAsyncThunk(
  "/get/courses",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await toast.promise(
        axiosInstance.post("/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }),
        {
          loading: "Creating the course...",
          success: "Course created successfully",
          error: "Failed to create course",
        }
      );

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  }
);

// function to delete the course
export const deleteCourse = createAsyncThunk("/course/delete", async (id, { rejectWithValue }) => {
  try {
    const resPromise = axiosInstance.delete(`/courses/${id}`);

    toast.promise(resPromise, {
      loading: "Deleting the course...",
      success: "Course deleted successfully",
      error: "Failed to delete course",
    });

    const response = await resPromise;
    return { success: true, id };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    return rejectWithValue(error?.response?.data);
  }
});

// function to update the course details
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const courseId = formData.get("courseId");

      if (!courseId) {
        return rejectWithValue("Course ID is missing for update.");
      }

      const res = await toast.promise(
        axiosInstance.put(`/courses/${courseId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }),
        {
          loading: "Updating course...",
          success: "Course updated successfully",
          error: "Failed to update course",
        }
      );

      return res.data.course;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Update failed");
    }
  }
);



const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourses.fulfilled, (state, action) => {
        if (action.payload) {
          state.coursesData = [...action.payload];
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.coursesData = state.coursesData.filter(
            (course) => course._id !== action.payload.id
          );
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
      const updatedCourse = action.payload; 
      if (updatedCourse) {
        const index = state.coursesData.findIndex(
        (course) => course._id === updatedCourse._id
      );
      if (index !== -1) {
        state.coursesData[index] = updatedCourse;
      }
    }
});

  },
});

export default courseSlice.reducer;
