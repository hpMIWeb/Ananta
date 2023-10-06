import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getIndustryTypeListReducersApi = createAsyncThunk(
    "getIndustryTypeListReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(`${apiEndpoint}industryType/get/`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            params: payload,
        });
        return response.data;
    }
);

const getIndustryTypeListReducersSlice = createSlice({
    name: "getIndustryTypeListReducersApi",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIndustryTypeListReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getIndustryTypeListReducersApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(
                getIndustryTypeListReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Industry Type List."); // Display error toast
                }
            );
    },
});

export default getIndustryTypeListReducersSlice.reducer;
