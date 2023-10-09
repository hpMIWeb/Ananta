import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { apiEndpoint, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";

interface Payload {
    payload: any;
    addonsId: string | undefined;
}
interface State {
    data: any;
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: State = {
    data: {},
    loading: false,
    success: false,
    error: null,
};

export const createAddonsReducersApi = createAsyncThunk(
    "createAddonsReducers",
    async ({ payload, addonsId }: Payload) => {
        const jwtToken = Cookies.get("jwt_token");
        const response = !addonsId
            ? await axios.post(`${apiEndpoint}add-on/create-add-on`, payload, {
                  headers: {
                      Authorization: `Bearer ${jwtToken}`,
                  },
              })
            : await axios.put(
                  `${apiEndpoint}add-on/update-add-on/id=${addonsId}`,
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

const createAddonsReducersReducersSlice = createSlice({
    name: "createAddonsReducersApi",
    initialState,
    reducers: {
        resetStateCreateAddons: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAddonsReducersApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAddonsReducersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
                const strMessage = `AddOns ${
                    action.meta.arg.addonsId && action.meta.arg.addonsId !== ""
                        ? "Updated"
                        : "Created"
                } Successfully`;
                toast.success(strMessage);
            })
            .addCase(createAddonsReducersApi.rejected, (state: any, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message;
                toast.error("An error occurred during Creating Addons."); // Display error toast
            });
    },
});

export const { resetStateCreateAddons } =
    createAddonsReducersReducersSlice.actions;

export default createAddonsReducersReducersSlice.reducer;
