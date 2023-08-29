import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getSubscriptionsListApi = createAsyncThunk(
    "subscription/getsubscription",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}subscription/get-subscription/`,
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

const getSubscriptionsListSlice = createSlice({
    name: "getSubscriptionsListApi",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubscriptionsListApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getSubscriptionsListApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(getSubscriptionsListApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Subscriptions List."); // Display error toast
            });
    },
});

export default getSubscriptionsListSlice.reducer;
