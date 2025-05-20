import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scrollPositions: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    saveScrollPosition: (state, action) => {
      const { key, position } = action.payload;
      state.scrollPositions[key] = position;
    },
    clearScrollPositions: (state) => {
      state.scrollPositions = {};
    },
  },
});

export const { saveScrollPosition, clearScrollPositions } = uiSlice.actions;

export default uiSlice.reducer;
