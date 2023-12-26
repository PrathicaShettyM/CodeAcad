import { createSlice } from "@reduxjs/toolkit"

// to maintain the old state
const initialState = {
    isLoggedIn : localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: localStorage.getItem("data") || {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}
})
export default authSlice.reducer;

