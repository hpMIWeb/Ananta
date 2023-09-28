import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    subscriptionId: string;
}

export const createAssociatePartnerReducersApi = createAsyncThunk(
    "createAssociatePartnerReducers",
    async ({ payload, subscriptionId }: Payload) => {
        console.log(payload);
        const jwtToken = Cookies.get("jwt_token");
        const response = !subscriptionId
            ? await axios.post(
                  `${apiEndpoint}admin/associated-partner-signup`,
                  payload,
                  {
                      headers: {
                          Authorization: `Bearer ${jwtToken}`,
                      },
                  }
              )
            : await axios.put(
                  `${apiEndpoint}admin/client-signup/id=${subscriptionId}`,
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

interface CreateAssociatePartnerReducersState {
    data: any;
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: CreateAssociatePartnerReducersState = {
    data: null,
    loading: false,
    success: false,
    error: null,
};

const createAssociatePartnerReducersSlice = createSlice({
    name: "createAssociatePartnerReducersApi",
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
            .addCase(createAssociatePartnerReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                createAssociatePartnerReducersApi.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = action.payload;
                    toast.success("Subscription Created Successfully");
                }
            )
            .addCase(
                createAssociatePartnerReducersApi.rejected,
                (state, action: any) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error(
                        "An error occurred during Creating Subscription."
                    );
                }
            );
    },
});

export const { resetStateCreateClient, resetStateCreateSubscriptions } =
    createAssociatePartnerReducersSlice.actions;

export default createAssociatePartnerReducersSlice.reducer;
