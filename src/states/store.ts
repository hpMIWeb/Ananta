import { configureStore } from "@reduxjs/toolkit";
import app from "./app";
import loginReducers from "../redux/loginReducers";
import { useDispatch } from "react-redux";

const store = configureStore({
    reducer: {
        app,
        loginReducers,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
