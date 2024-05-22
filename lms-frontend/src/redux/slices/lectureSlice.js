import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";
const initialState = {
    lectures: []
}

export const getCourseLecture = createAsyncThunk("/course/lecture/get", async (cid) => {
    try {
        const response = axiosInstance.get(`/courses/${cid}`);
        toast.promise(response, {
            loading: "Fetching course lecture",
            success: "Fetched course lecture",
            error: "Failed to fetch the lecture"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const addCourseLecture = createAsyncThunk("/course/lecture/add", async (data) => {
    try {
        const formData = new FormData();
        formData.append("lectures", data.lecture);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const response = axiosInstance.get(`/courses/${data.id}`, formData);
        toast.promise(response, {
            loading: "adding course lectures",
            success: "added course lectures",
            error: "Failed to add lectures"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const deleteCourseLecture = createAsyncThunk("/course/lecture/delete", async (data) => {
    try {
        const response = axiosInstance.get(`/courses?.courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(response, {
            loading: "deleting course lecture",
            success: "deleted course lecture",
            error: "Failed to delete lecture"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourseLecture.fulfilled, (state, action) => {
            state.lectures = action?.payload?.lectures;
        })
        builder.addCase(addCourseLecture.fulfilled, (state, action) => {
            state.lectures = action?.payload?.course?.lectures;
        })
    }
});
export default lectureSlice.reducer;
    