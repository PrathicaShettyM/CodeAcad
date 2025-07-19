import { configureStore } from "@reduxjs/toolkit"

import authReducer from './slices/authSlice';
import courseReducer from "./slices/courseSlice";
import lectureReducer from "./slices/lectureSlice";
import razorpayReducer from "./slices/razorpaySlice";
import statReducer from "./slices/statSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        razorpay: razorpayReducer,
        lecture: lectureReducer,
        stat: statReducer,
    },
});

export default store;