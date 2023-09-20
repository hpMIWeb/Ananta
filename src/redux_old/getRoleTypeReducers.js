import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiEndpoint } from "../utils/helpers";

export const getRoleTypeReducersApi = createAsyncThunk(
  "getRoleTypeReducersApi",
  async (payload) => {
    const jwtToken = Cookies.get("jwt_token");
    const response = await axios.get(`${apiEndpoint}role-type/get-role-type/?search=on`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      params: payload,
    });
    return response.data;
  }
);

const getRoleTypeReducersSlice = createSlice({
  name: "getRoleTypeReducersApi",
  initialState: {
    data: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoleTypeReducersApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleTypeReducersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload.payload;
      })
      .addCase(getRoleTypeReducersApi.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message;
        toast.error(action.error.message); 
      });
  },
});

export default getRoleTypeReducersSlice.reducer;
