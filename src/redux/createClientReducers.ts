import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    subscriptionId: string;
}

export const createClientReducersApi = createAsyncThunk(
    "createClientReducers",
    async ({ payload, subscriptionId }: Payload) => {
        console.log(payload);
        const jwtToken = Cookies.get("jwt_token");
        const response = !subscriptionId
            ? await axios.post(`${apiEndpoint}admin/client-signup`, payload, {
                  headers: {
                      Authorization: `Bearer ${jwtToken}`,
                  },
              })
            : await axios.put(`${apiEndpoint}admin/update-profile`, payload, {
                  headers: {
                      Authorization: `Bearer ${jwtToken}`,
                  },
              });
        return response.data;
    }
);

interface CreateClientReducersState {
    data: any;
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: CreateClientReducersState = {
    data: null,
    loading: false,
    success: false,
    error: null,
};

const createClientReducersSlice = createSlice({
    name: "createClientReducersApi",
    initialState,
    reducers: {
        resetStateCreateClient: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = {};
        },
        resetStateCreateSubscriptions: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClientReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(createClientReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                toast.success("Client Created Successfully");
            })
            .addCase(createClientReducersApi.rejected, (state, action: any) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Creating Client.");
            });
    },
});

export const { resetStateCreateClient, resetStateCreateSubscriptions } =
    createClientReducersSlice.actions;

export default createClientReducersSlice.reducer;
