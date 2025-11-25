import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async ({ username, password }, { getState, rejectWithValue }) => {
  try {
    // First try dummyjson API
    const res = await axios.post('https://dummyjson.com/auth/login', 
      { username, password, expiresInMins: 60 },
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('API login success:', res.data);
    return res.data;
  } catch (apiError) {
    console.log('API login failed:', apiError.response?.status, apiError.response?.data);
    
    // Fallback: check registered users in Redux state
    const state = getState();
    const registeredUser = state.users?.registered?.find(u => u.username === username && u.password === password);
    
    if (registeredUser) {
      console.log('Registered user login success');
      return {
        ...registeredUser,
        accessToken: 'mock-token-' + Date.now(),
        refreshToken: 'mock-refresh-' + Date.now()
      };
    }
    
    // Return specific error message
    const errorMsg = apiError.response?.data?.message || apiError.message || 'Login failed';
    console.log('Final error:', errorMsg);
    return rejectWithValue(errorMsg);
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, refreshToken: null, status: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      });
  }
});

export const { logout, setUser } = slice.actions;
export default slice.reducer;
