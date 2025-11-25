import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Transport API credentials - you'll need to add your own from https://developer.transportapi.com/
const TRANSPORT_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your API key
const TRANSPORT_APP_ID = 'YOUR_APP_ID_HERE'; // Replace with your App ID

export const fetchItems = createAsyncThunk('items/fetch', async (_, { rejectWithValue }) => {
  try {
    // Fetch UK bus services and routes
    // Example: fetching services in London area
    const res = await axios.get(
      `https://api.transportapi.com/v3/uk/services.json`,
      {
        params: {
          api_key: '112d86e758b5f4ced76113f1180eeabf',
          app_id: '81f59e48',
          bounding_box: '-0.5,51.3,0.0,51.6', // London area (southwest, northeast)
          service_type: 'bus'
        }
      }
    );
    
    // Transform API response to match item card format
    return (res.data.services || []).map((service, idx) => ({
      id: idx,
      title: service.service_number ? `Route ${service.service_number}` : service.name,
      description: service.description || `${service.operator} - Bus Service`,
      brand: service.operator || 'Transport UK',
      thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=80&h=80&fit=crop',
      images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop'],
      rating: 4.5,
      price: service.fare || '£1.75',
      name: service.service_number ? `Route ${service.service_number}` : service.name
    }));
  } catch (error) {
    console.log('Transport API error:', error.message);
    
    // Fallback: mock transport data
    return [
      {
        id: 1,
        title: 'Route 15',
        description: 'Victoria Station to Oxford Street via Marble Arch',
        brand: 'TfL',
        thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop'],
        rating: 4.8,
        price: '£1.75',
        name: 'Route 15',
        from: 'Victoria Station',
        to: 'Oxford Street'
      },
      {
        id: 2,
        title: 'Route 42',
        description: 'King\'s Road to Elephant & Castle via London Bridge',
        brand: 'TfL',
        thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'],
        rating: 4.6,
        price: '£1.75',
        name: 'Route 42',
        from: 'King\'s Road',
        to: 'Elephant & Castle'
      },
      {
        id: 3,
        title: 'Route 87',
        description: 'Marble Arch to Clapham Common via Victoria Station',
        brand: 'TfL',
        thumbnail: 'https://images.unsplash.com/photo-1581262177000-8c2e6d5a0de7?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1581262177000-8c2e6d5a0de7?w=400&h=300&fit=crop'],
        rating: 4.5,
        price: '£1.75',
        name: 'Route 87',
        from: 'Marble Arch',
        to: 'Clapham Common'
      },
      {
        id: 4,
        title: 'District Line',
        description: 'Victoria Station to Tower of London - Underground Metro Service',
        brand: 'TfL',
        thumbnail: 'https://images.unsplash.com/photo-1530482054429-cc491f61333b?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1530482054429-cc491f61333b?w=400&h=300&fit=crop'],
        rating: 4.7,
        price: '£1.90',
        name: 'District Line',
        from: 'Victoria Station',
        to: 'Tower of London'
      },
      {
        id: 5,
        title: 'Piccadilly Line',
        description: 'Covent Garden to Oxford Street - Underground Metro Service',
        brand: 'TfL',
        thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'],
        rating: 4.4,
        price: '£1.90',
        name: 'Piccadilly Line',
        from: 'Covent Garden',
        to: 'Oxford Street'
      },
      {
        id: 6,
        title: 'Avanti West Coast',
        description: 'London Euston to Manchester Piccadilly - High-speed train service',
        brand: 'Avanti',
        thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop'],
        rating: 4.6,
        price: '£45.00',
        name: 'Avanti West Coast',
        from: 'London',
        to: 'Manchester'
      },
      {
        id: 7,
        title: 'CrossCountry',
        description: 'Birmingham New Street to Manchester Piccadilly',
        brand: 'CrossCountry',
        thumbnail: 'https://images.unsplash.com/photo-1581262177000-8c2e6d5a0de7?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1581262177000-8c2e6d5a0de7?w=400&h=300&fit=crop'],
        rating: 4.5,
        price: '£28.00',
        name: 'CrossCountry',
        from: 'Birmingham',
        to: 'Manchester'
      },
      {
        id: 8,
        title: 'LNER',
        description: 'London King\'s Cross to Edinburgh Waverley - East Coast Main Line',
        brand: 'LNER',
        thumbnail: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=300&fit=crop'],
        rating: 4.8,
        price: '£65.00',
        name: 'LNER',
        from: 'London',
        to: 'Edinburgh'
      },
      {
        id: 9,
        title: 'TransPennine Express',
        description: 'Manchester to Liverpool Lime Street - Express service',
        brand: 'TPE',
        thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80&h=80&fit=crop',
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'],
        rating: 4.4,
        price: '£18.50',
        name: 'TransPennine Express',
        from: 'Manchester',
        to: 'Liverpool'
      }
    ];
  }
});

const slice = createSlice({
  name: 'items',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchItems.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        // Still show mock data on error
        state.list = [
          {
            id: 1,
            title: 'Route 15',
            description: 'Central London Bus Service - Red Route',
            brand: 'TfL',
            thumbnail: 'https://via.placeholder.com/80?text=Route+15',
            images: ['https://via.placeholder.com/200?text=Route+15'],
            rating: 4.8,
            price: '£1.75'
          },
          {
            id: 2,
            title: 'Route 42',
            description: 'King\'s Road to Elephant & Castle',
            brand: 'TfL',
            thumbnail: 'https://via.placeholder.com/80?text=Route+42',
            images: ['https://via.placeholder.com/200?text=Route+42'],
            rating: 4.6,
            price: '£1.75'
          },
          {
            id: 3,
            title: 'Route 87',
            description: 'Marble Arch to Clapham Common',
            brand: 'TfL',
            thumbnail: 'https://via.placeholder.com/80?text=Route+87',
            images: ['https://via.placeholder.com/200?text=Route+87'],
            rating: 4.5,
            price: '£1.75'
          }
        ];
      });
  }
});

export default slice.reducer;
