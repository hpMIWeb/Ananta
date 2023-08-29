import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getPromocodeReducersListApi = createAsyncThunk(
    "getPromocodeReducers",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}promocode/get-promocode`,
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

const getPromocodeReducersListSlice = createSlice({
    name: "getPromocodeReducersListApi",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPromocodeReducersListApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getPromocodeReducersListApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(
                getPromocodeReducersListApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error("An error occurred during Promocode List."); // Display error toast
                }
            );
    },
});

export default getPromocodeReducersListSlice.reducer;
