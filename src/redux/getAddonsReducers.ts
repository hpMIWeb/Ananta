import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

interface Payload {
    payload: any;
}

interface GetAddonsReducersListState {
    data: any[];
    loading: boolean;
    success: boolean;
    error: string | null;
}

export const getAddonsReducersListApi = createAsyncThunk(
    "subscription/getAddonsReducers",
    async (payload: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(`${apiEndpoint}add-on/get-add-on`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            params: payload,
        });
        return response.data;
    }
);

const getAddonsReducersListSlice = createSlice({
    name: "getAddonsReducersListApi",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    } as GetAddonsReducersListState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAddonsReducersListApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAddonsReducersListApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = [...action.payload.payload];
            })
            .addCase(
                getAddonsReducersListApi.rejected,
                (state, action: any) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Addons List."); // Display error toast
                }
            );
    },
});

export default getAddonsReducersListSlice.reducer;
