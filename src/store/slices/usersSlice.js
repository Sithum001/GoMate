import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk('users/register', async ({ username, password, email }, { rejectWithValue }) => {
  // Mock registration: validate and return user object
  if (!username || !password || !email) {
    return rejectWithValue('All fields are required');
  }
  if (password.length < 4) {
    return rejectWithValue('Password must be at least 4 characters');
  }
  // Simulate async delay
  await new Promise(r => setTimeout(r, 500));
  return { 
    username, 
    password, 
    email, 
    firstName: username,
    lastName: 'User',
    id: Date.now()
  };
});

const slice = createSlice({
  name: 'users',
  initialState: { registered: [], status: 'idle', error: null },
  reducers: {
    addUser: (state, action) => {
      if (!state.registered.find(u => u.username === action.payload.username)) {
        state.registered.push(action.payload);
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (!state.registered.find(u => u.username === action.payload.username)) {
          state.registered.push(action.payload);
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      });
  }
});

export const { addUser } = slice.actions;
export default slice.reducer;
