import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getUserInfoReducersApi = createAsyncThunk(
    "getUserInfoReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(`${apiEndpoint}admin/get-profile`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            params: payload,
        });
        return response.data;
    }
);

const getUserInfoReducersSlice = createSlice({
    name: "getUserInfoReducersApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfoReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserInfoReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload.payload;
            })
            .addCase(getUserInfoReducersApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Addons List."); // Display error toast
            });
    },
});

export default getUserInfoReducersSlice.reducer;
