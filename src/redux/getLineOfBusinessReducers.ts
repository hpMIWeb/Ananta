import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getLineOfBusinessReducersApi = createAsyncThunk(
    "getLineOfBusinessReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(`${apiEndpoint}lineOfBusiness/get`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            params: payload,
        });
        return response.data;
    }
);

const getLineOfBusinessReducersSlice = createSlice({
    name: "getLineOfBusinessReducersApi",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLineOfBusinessReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getLineOfBusinessReducersApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(
                getLineOfBusinessReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Industry Type List."); // Display error toast
                }
            );
    },
});

export default getLineOfBusinessReducersSlice.reducer;
