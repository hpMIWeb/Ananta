import { createSlice } from "@reduxjs/toolkit";

const app = createSlice({
  name: "app",
  initialState: {
    hello: "hello there",
    counter: 0,
  },
  reducers: {
    setCounter(state) {
      state.counter += 1;
    },
  },
});

export const { setCounter } = app.actions;

export default app.reducer;
