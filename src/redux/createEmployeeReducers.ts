import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    employeeId: string;
}

export const createEmployeeReducersApi = createAsyncThunk(
    "createEmployeeReducers",
    async ({ payload, employeeId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = !employeeId
            ? await axios.post(`${apiEndpoint}admin/employee-signup`, payload, {
                  headers: {
                      Authorization: `Bearer ${jwtToken}`,
                  },
              })
            : await axios.put(
                  `${apiEndpoint}admin/update-profile/${employeeId}`,
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
                toast.success(
                    action.meta.arg.employeeId === ""
                        ? "Employee Created Successfully."
                        : "Employee Updated Successfully."
                );
            })
            .addCase(createEmployeeReducersApi.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                //TODO: state.error = action.error.message;
                toast.error("An error occurred during Creating Employee."); // Display error toast
            });
    },
});

export const { resetStateCreateEmployee } = createEmployeeReducersSlice.actions;

export default createEmployeeReducersSlice.reducer;
