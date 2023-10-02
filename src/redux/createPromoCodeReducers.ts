import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    promoId: string | undefined;
}

export const createPromoCodeApi = createAsyncThunk(
    "createPromoCode",
    async ({ payload, promoId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = !promoId
            ? await axios.post(
                  `${apiEndpoint}promocode/create-promocode`,
                  payload,
                  {
                      headers: {
                          Authorization: `Bearer ${jwtToken}`,
                      },
                  }
              )
            : await axios.put(
                  `${apiEndpoint}promocode/update-promocode`,
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

const createPromoCodeReducersSlice = createSlice({
    name: "createPromoCodeApi",
    initialState: {
        data: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetStateCreatePromocode: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPromoCodeApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPromoCodeApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                toast.success("Promo code Created Successfully");
            })
            .addCase(createPromoCodeApi.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                // state.error = action.error.message;
                toast.error("An error occurred during Creating Promo code."); // Display error toast
            });
    },
});

export const { resetStateCreatePromocode } =
    createPromoCodeReducersSlice.actions;

export default createPromoCodeReducersSlice.reducer;
