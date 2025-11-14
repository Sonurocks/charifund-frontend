
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {navScrolled: boolean; }= {
  navScrolled: false,
};

const scrollSlice = createSlice({
  name: 'navScroll',
  initialState,
  reducers: {
    setNavScrolled: (state, action: PayloadAction<boolean>) => {
      state.navScrolled = action.payload;
    },
  },
});

export const { setNavScrolled } = scrollSlice.actions;
export default scrollSlice.reducer;
