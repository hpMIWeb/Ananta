import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";

interface Payload {
    subscriptionId: string;
}

export const deleteSubscriptionsReducersApi = createAsyncThunk(
    "deleteSubscriptions",
    async ({ subscriptionId }: Payload) => {
        const jwtToken = getAuthToken;
        const response = await axios.delete(
            `${apiEndpoint}subscription/delete-subscription/id=${subscriptionId}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        );
        return response.data;
    }
);

const deleteSubscriptionsReducersSlice = createSlice({
    name: "deleteSubscriptionsReducersApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetStateDeleteSubscriptions: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteSubscriptionsReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                deleteSubscriptionsReducersApi.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = action.payload;
                    toast.success("Subscription Deleted Successfully");
                }
            )
            .addCase(
                deleteSubscriptionsReducersApi.rejected,
                (state: any, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error.message;
                    toast.error(
                        "An error occurred during Deleting Subscription."
                    ); // Display error toast
                }
            );
    },
});

export const { resetStateDeleteSubscriptions } =
    deleteSubscriptionsReducersSlice.actions;

export default deleteSubscriptionsReducersSlice.reducer;
