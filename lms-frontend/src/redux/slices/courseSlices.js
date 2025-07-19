import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from '../../config/axiosInstance'
// to maintain the old state
const initialState = {
    courseList: []
}
// using async thunk

export const getAllCourses = createAsyncThunk("/course/getAllCourses", async (data) => {
    try {
        const response = axiosInstance.get("/courses", data);
        toast.promise(response, {
            loading: 'Wait! fetching all courses',
            success: (data)=> {
                return data?.data?.message;
            },
            error: 'Failed to load courses'
        });
        return (await response).data.courses;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})

export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);


        const response = axiosInstance.post("/courses", formData);
        toast.promise(response, {
            loading: 'Wait! creating new course',
            success: (data)=> {
                return data?.data?.message;
            },
            error: 'Failed to create course'
        });
        return (await response).data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

// function to delete the course
export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  try {
    const res = axiosInstance.delete(`courses/${id}`);

    toast.promise(res, {
      loading: "Deleting the course...",
      success: "Courses deleted successfully",
      error: "Failed to delete course",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// function to update the course details
export const updateCourse = createAsyncThunk("/course/update", async (data) => {
  try {
    // creating the form data from user data
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("createdBy", data.createdBy);
    formData.append("description", data.description);
    // backend is not allowing change of thumbnail
    // if (data.thumbnail) {
    //   formData.append("thumbnail", data.thumbnail);
    // }

    const res = axiosInstance.put(`/courses/${data.id}`, {
      title: data.title,
      category: data.category,
      createdBy: data.createdBy,
      description: data.description,
    });

    toast.promise(res, {
      loading: "Updating the course...",
      success: "Course updated successfully",
      error: "Failed to update course",
    });

    const response = await res;
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action)=>{
            if(action?.payload){
                state.courseList = [...action.payload];
            }
        })
    }
});

export const {} = courseSlice.actions;
export default courseSlice.reducer;


