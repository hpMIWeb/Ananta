import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";

export const createEmployeeReducersApi = createAsyncThunk(
  "createEmployeeReducers",
  async ({ payload, subscriptionId }) => { 
    const jwtToken = getAuthToken;
    const response = !subscriptionId
      ? await axios.post(`${apiEndpoint}admin/employee-signup`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
      : await axios.put(`${apiEndpoint}admin/employee-signup/id=${subscriptionId}`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
    return response.data;
  }
);

const createEmployeeReducersSlice = createSlice({
  name: "createEmployeeReducersApi",
  initialState: {
    data: {},
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStateCreateEmployee: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeReducersApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployeeReducersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        toast.success("Subscription Created Successfully");
      })
      .addCase(createEmployeeReducersApi.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
        toast.error("An error occurred during Creating Subscription."); // Display error toast
      });
  },
});

export const { resetStateCreateSubscriptions } = createEmployeeReducersSlice.actions;

export default createEmployeeReducersSlice.reducer;
