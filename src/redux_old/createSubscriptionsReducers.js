import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";

export const createSubscriptionsReducersApi = createAsyncThunk(
  "createSubscriptions",
  async ({ payload, subscriptionId }) => { 
    const jwtToken = getAuthToken;
    const response = !subscriptionId
      ? await axios.post(`${apiEndpoint}subscription/create-subscription`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
      : await axios.put(`${apiEndpoint}subscription/update-subscription/id=${subscriptionId}`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
    return response.data;
  }
);

const createSubscriptionsReducersSlice = createSlice({
  name: "createSubscriptionsReducersApi",
  initialState: {
    data: {},
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStateCreateSubscriptions: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionsReducersApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubscriptionsReducersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        toast.success("Subscription Created Successfully");
      })
      .addCase(createSubscriptionsReducersApi.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
        toast.error("An error occurred during Creating Subscription."); // Display error toast
      });
  },
});

export const { resetStateCreateSubscriptions } = createSubscriptionsReducersSlice.actions;

export default createSubscriptionsReducersSlice.reducer;
