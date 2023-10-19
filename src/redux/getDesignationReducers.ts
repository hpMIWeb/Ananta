import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getDesignationReducersApi = createAsyncThunk(
    "getDesignationReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}designation/get-designation/`,
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

const getDesignationReducersSlice = createSlice({
    name: "getDesignationReducersApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDesignationReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDesignationReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload.payload;
            })
            .addCase(
                getDesignationReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Designation List."); // Display error toast
                }
            );
    },
});

export default getDesignationReducersSlice.reducer;
