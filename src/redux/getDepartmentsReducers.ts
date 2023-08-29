import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getDepartmentsReducersApi = createAsyncThunk(
    "getDepartmentsReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}department/get-department/`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                params: payload,
            }
        );
        return response.data;
    }
);

const getDepartmentsReducersSlice = createSlice({
    name: "getDepartmentsReducersApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentsReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDepartmentsReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload.payload;
            })
            .addCase(
                getDepartmentsReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Addons List."); // Display error toast
                }
            );
    },
});

export default getDepartmentsReducersSlice.reducer;
