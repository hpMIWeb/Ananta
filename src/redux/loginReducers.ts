import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";
import { ILogin } from "../app/utilities/globalInterfaces";

export const loginUserApi = createAsyncThunk(
    "login/loginUserApi",
    async (credentials: ILogin, ThunkAPI) => {
        const response = await axios.post(
            `${apiEndpoint}admin/login`,
            credentials
        );
        return response.data;
    }
);

export interface ILoginData {
    data: any;
    loading: boolean;
    success: boolean;
    error: any;
}

export const loginUserApiTest = createAsyncThunk(
    "login/loginUserApi",
    async (thunkAPI) => {
        console.log("login test");
        return { test: "demo test" };
        //const response = await axios.post(`${apiEndpoint}admin/login`);
        //return response.data;
    }
);

const initialState: ILoginData = {
    data: null,
    loading: false,
    success: false,
    error: null,
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUserApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUserApi.fulfilled, (state, action) => {
                const jwtToken = action.payload?.payload?.token;
                localStorage.setItem("authtoken", jwtToken);
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                toast.success(action.payload?.message);
            })
            .addCase(loginUserApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during login."); // Display error toast
            });
    },
});

export default loginSlice.reducer;
