import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' }, // 'light' or 'dark'
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    }
  }
});

export const { toggleTheme, setTheme } = slice.actions;
export default slice.reducer;
