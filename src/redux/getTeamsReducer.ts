import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getTeamReducersApi = createAsyncThunk(
    "getTeamReducersApi",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(`${apiEndpoint}team/get-team`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            params: payload,
        });
        return response.data;
    }
);

const getTeamReducersSlice = createSlice({
    name: "getTeamReducersApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTeamReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTeamReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload.payload;
            })
            .addCase(getTeamReducersApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Team List."); // Display error toast
            });
    },
});

export default getTeamReducersSlice.reducer;
