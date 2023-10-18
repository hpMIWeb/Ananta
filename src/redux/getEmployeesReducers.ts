import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";


export const getEmployeesReducersApi = createAsyncThunk(
    "getEmployeesReducers/get",
    async (payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.get(
            `${apiEndpoint}admin/get-user-employee`,
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

const getEmployeesReducersSlice = createSlice({
    name: "getEmployeesReducers",
    initialState: {
        data: [],
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEmployeesReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getEmployeesReducersApi.fulfilled,
                (state: any, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = [...action.payload.payload];
                }
            )
            .addCase(getEmployeesReducersApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Employee List."); // Display error toast
            });
    },
});

export default getEmployeesReducersSlice.reducer;
