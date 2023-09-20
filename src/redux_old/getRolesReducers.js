import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getRolesReducersApi = createAsyncThunk(
  "getRolesReducersApi",
  async (payload) => {
    const jwtToken = Cookies.get("jwt_token");
    const response = await axios.get(`${apiEndpoint}role/`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      params: payload,
    });
    return response.data;
  }
);

const getRolesReducersSlice = createSlice({
  name: "getRolesReducersApi",
  initialState: {
    data: {},
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRolesReducersApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRolesReducersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.payload?.allRole;
      })
      .addCase(getRolesReducersApi.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
        toast.error("An error occurred during Addons List."); // Display error toast
      });
  },
});

export default getRolesReducersSlice.reducer;
