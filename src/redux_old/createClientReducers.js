import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";

export const createClientReducersApi = createAsyncThunk(
  "createClientReducers",
  async ({ payload, subscriptionId }) => { 
    const jwtToken = getAuthToken;
    const response = !subscriptionId
      ? await axios.post(`${apiEndpoint}admin/client-signup`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
      : await axios.put(`${apiEndpoint}admin/client-signup/id=${subscriptionId}`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
    return response.data;
  }
);

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
        toast.success("Subscription Created Successfully");
      })
      .addCase(createClientReducersApi.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
        toast.error("An error occurred during Creating Subscription."); // Display error toast
      });
  },
});

export const { resetStateCreateSubscriptions } = createClientReducersSlice.actions;

export default createClientReducersSlice.reducer;
