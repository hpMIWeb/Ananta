import { configureStore } from "@reduxjs/toolkit";
import app from "./app";

const store = configureStore({
  reducer: {
    app,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
