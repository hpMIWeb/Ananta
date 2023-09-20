import { configureStore } from "@reduxjs/toolkit";
import app from "./app";
import loginReducers from "../../redux/loginReducers";
import getClientsReducers from "../../redux/getClientsReducers";
import createClientReducers from "../../redux/createClientReducers";
import getAddonsReducers from "../../redux/getAddonsReducers";
import getEmployeesReducers from "../../redux/getEmployeesReducers";
import getRolesReducers from "../../redux/getRolesReducers";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    app,
    loginReducers,
    getClientsReducers,
    createClientReducers,
    getAddonsReducers,
    getEmployeesReducers,
    getRolesReducers,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
