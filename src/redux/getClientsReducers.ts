import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getClientsReducersApi = createAsyncThunk(
    "getClientsReducers/get",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}admin/get-user-client`,
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

const getClientsReducersSlice = createSlice({
    name: "getClientsReducers",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClientsReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClientsReducersApi.fulfilled, (state: any, action) => {
                state.loading = false;
                state.success = true;
                state.data = [...action.payload.payload];
            })
            .addCase(getClientsReducersApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Client List."); // Display error toast
            });
    },
});

export default getClientsReducersSlice.reducer;
