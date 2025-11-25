import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock transport schedules
const mockSchedules = {
  1: [
    { time: '06:30', destination: 'Victoria Station', duration: '12 mins', capacity: 'High' },
    { time: '06:45', destination: 'Victoria Station', duration: '12 mins', capacity: 'Medium' },
    { time: '07:00', destination: 'Victoria Station', duration: '12 mins', capacity: 'High' },
    { time: '07:15', destination: 'Victoria Station', duration: '12 mins', capacity: 'High' },
    { time: '07:30', destination: 'Victoria Station', duration: '12 mins', capacity: 'Medium' },
    { time: '07:45', destination: 'Victoria Station', duration: '12 mins', capacity: 'Low' },
    { time: '08:00', destination: 'Victoria Station', duration: '12 mins', capacity: 'High' },
    { time: '08:15', destination: 'Victoria Station', duration: '12 mins', capacity: 'High' },
  ],
  2: [
    { time: '06:15', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'Medium' },
    { time: '06:45', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'High' },
    { time: '07:15', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'Low' },
    { time: '07:45', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'High' },
    { time: '08:15', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'Medium' },
    { time: '08:45', destination: 'Elephant & Castle', duration: '18 mins', capacity: 'High' },
  ],
  3: [
    { time: '06:00', destination: 'Clapham Common', duration: '24 mins', capacity: 'High' },
    { time: '06:30', destination: 'Clapham Common', duration: '24 mins', capacity: 'Medium' },
    { time: '07:00', destination: 'Clapham Common', duration: '24 mins', capacity: 'High' },
    { time: '07:30', destination: 'Clapham Common', duration: '24 mins', capacity: 'Low' },
    { time: '08:00', destination: 'Clapham Common', duration: '24 mins', capacity: 'High' },
  ],
};

export const fetchSchedules = createAsyncThunk('schedules/fetch', async (routeId) => {
  // Simulate API call
  await new Promise(r => setTimeout(r, 500));
  return mockSchedules[routeId] || [];
});

const slice = createSlice({
  name: 'schedules',
  initialState: { 
    schedules: mockSchedules, 
    selectedRoute: 1, 
    status: 'idle', 
    error: null, 
    loading: false 
  },
  reducers: {
    setSelectedRoute: (state, action) => {
      state.selectedRoute = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSchedules.pending, state => { 
        state.status = 'loading'; 
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedRoute } = slice.actions;
export default slice.reducer;
