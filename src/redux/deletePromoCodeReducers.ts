import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    promoCodeId: string | undefined;
}

export const deletePromoCodeReducersApi = createAsyncThunk(
    "deletePromoCodeReducers",
    async ({ promoCodeId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = await axios.delete(
            `${apiEndpoint}promocode/delete-promocode?${promoCodeId}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        );
        return response.data;
    }
);

const deletePromoCodeReducersSlice = createSlice({
    name: "deletePromoCodeReducersApi",
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
            .addCase(deletePromoCodeReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePromoCodeReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                toast.success("PromoCode Deleted Successfully");
            })
            .addCase(
                deletePromoCodeReducersApi.rejected,
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
    deletePromoCodeReducersSlice.actions;

export default deletePromoCodeReducersSlice.reducer;
