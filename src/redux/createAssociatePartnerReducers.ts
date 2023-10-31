import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    associatePartnerId: string;
}

export const createAssociatePartnerReducersApi = createAsyncThunk(
    "createAssociatePartnerReducers",
    async ({ payload, associatePartnerId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = !associatePartnerId
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
                  `${apiEndpoint}admin/update-profile/${associatePartnerId}`,
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
        resetStateCreateAssociatePartner: (state) => {
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
                    toast.success(
                        action.meta.arg.associatePartnerId === ""
                            ? "Associate Partner Created Successfully."
                            : "Associate Partner Updated Successfully."
                    );
                }
            )
            .addCase(
                createAssociatePartnerReducersApi.rejected,
                (state, action: any) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error(
                        "An error occurred during Creating Associate Partner."
                    );
                }
            );
    },
});

export const { resetStateCreateClient, resetStateCreateAssociatePartner } =
    createAssociatePartnerReducersSlice.actions;

export default createAssociatePartnerReducersSlice.reducer;
