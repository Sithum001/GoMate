import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'favourites',
  initialState: { items: [] },
  reducers: {
    addFavourite: (state, action) => {
      const id = action.payload.id;
      if (!state.items.find(i => i.id === id)) state.items.push(action.payload);
    },
    removeFavourite: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  }
});

export const { addFavourite, removeFavourite } = slice.actions;
export default slice.reducer;
