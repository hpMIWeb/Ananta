import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    clientId: string;
}

export const createClientReducersApi = createAsyncThunk(
    "createClientReducers",
    async ({ payload, clientId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = !clientId
            ? await axios.post(`${apiEndpoint}admin/client-signup`, payload, {
                  headers: {
                      Authorization: `Bearer ${jwtToken}`,
                  },
              })
            : await axios.put(
                  `${apiEndpoint}admin/update-profile/${clientId}`,
                  payload,
                  {
                      headers: {
                          Authorization: `Bearer ${jwtToken}`,
                      },
                  }
              );
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
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
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
        resetSuccessState: (state) => {
            state.success = false;
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
                toast.success(
                    action.meta.arg.clientId === ""
                        ? "Client Created Successfully."
                        : "Client Updated Successfully."
                );
            })
            .addCase(createClientReducersApi.rejected, (state, action: any) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Creating Client.");
            });
    },
});

export const {
    resetSuccessState,
    resetStateCreateClient,
    resetStateCreateSubscriptions,
} = createClientReducersSlice.actions;

export default createClientReducersSlice.reducer;
