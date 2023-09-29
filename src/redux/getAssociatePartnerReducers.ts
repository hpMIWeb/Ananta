import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getAssociatePartnerReducersApi = createAsyncThunk(
    "getAssociatePartnerReducers/get",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            //TODO :need to change with  Associate partner API
            `${apiEndpoint}admin/get-user-asscociatepartner`,
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

const getAssociatePartnerReducersSlice = createSlice({
    name: "getAssociatePartnerReducers",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAssociatePartnerReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getAssociatePartnerReducersApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(
                getAssociatePartnerReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error(
                        "An error occurred during Associate Partner List."
                    ); // Display error toast
                }
            );
    },
});

export default getAssociatePartnerReducersSlice.reducer;
