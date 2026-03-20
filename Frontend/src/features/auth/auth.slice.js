import { createSlice } from "@reduxjs/toolkit";

const authReducer = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
        success: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setSuccess: (state, action) => {
            state.success = action.payload
        }
    }
})

export const { setUser, setLoading, setError, setSuccess } = authReducer.actions
export default authReducer.reducer