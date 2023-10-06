import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    addonId: string | undefined;
}

export const deleteAddonReducersAi = createAsyncThunk(
    "deleteAddonReducers",
    async ({ addonId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.delete(
            `${apiEndpoint}add-on/delete-add-on/id=${addonId}`,
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
    name: "deleteAddonReducersAi",
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
            .addCase(deleteAddonReducersAi.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAddonReducersAi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                toast.success("Addon Deleted Successfully");
            })
            .addCase(deleteAddonReducersAi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Deleting Subscription."); // Display error toast
            });
    },
});

export const { resetStateDeleteSubscriptions } =
    deleteSubscriptionsReducersSlice.actions;

export default deleteSubscriptionsReducersSlice.reducer;
