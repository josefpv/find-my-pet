import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    activeMenu: 0,
  },
  reducers: {
    changeActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
  },
});

export const { changeActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;
