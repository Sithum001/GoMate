import { createSlice } from '@reduxjs/toolkit';

const mockDestinations = [
  {
    id: 1,
    name: 'Victoria Station',
    category: 'Railway Station',
    distance: '2.1 km',
    description: 'Major railway and coach station in central London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    rating: 4.6,
    visitors: '15K+',
    highlights: ['WiFi', 'Shops', 'Restaurants', 'Parking']
  },
  {
    id: 2,
    name: 'London Bridge Station',
    category: 'Railway Station',
    distance: '1.8 km',
    description: 'Historic railway station in Southeast London',
    image: 'https://images.unsplash.com/photo-1543832923-44667a44c804?w=400&h=300&fit=crop',
    rating: 4.5,
    visitors: '12K+',
    highlights: ['WiFi', 'Shopping Centre', 'Restaurants', 'Toilets']
  },
  {
    id: 3,
    name: 'Covent Garden',
    category: 'Shopping & Culture',
    distance: '0.5 km',
    description: 'Famous market with shops, restaurants & street performers',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    rating: 4.7,
    visitors: '45K+',
    highlights: ['Market', 'Restaurants', 'Street Art', 'Museums']
  },
  {
    id: 4,
    name: 'Big Ben & Parliament',
    category: 'Historical Landmark',
    distance: '1.2 km',
    description: 'Iconic parliament building and clock tower',
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400&h=300&fit=crop',
    rating: 4.8,
    visitors: '50K+',
    highlights: ['Tours', 'Photography', 'History', 'Guided Walks']
  },
  {
    id: 5,
    name: 'Tower of London',
    category: 'Historical Site',
    distance: '3.4 km',
    description: 'Medieval fortress and museum with Crown Jewels',
    image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400&h=300&fit=crop',
    rating: 4.9,
    visitors: '38K+',
    highlights: ['Museums', 'History', 'Crown Jewels', 'Tours']
  },
  {
    id: 6,
    name: 'British Museum',
    category: 'Museum',
    distance: '1.5 km',
    description: 'World-famous museum with art & historical artifacts',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    rating: 4.7,
    visitors: '41K+',
    highlights: ['Art', 'History', 'Free Entry', 'Guided Tours']
  },
  {
    id: 7,
    name: 'Oxford Street',
    category: 'Shopping',
    distance: '2.0 km',
    description: 'Major shopping street with hundreds of stores',
    image: 'https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=400&h=300&fit=crop',
    rating: 4.4,
    visitors: '60K+',
    highlights: ['Shopping', 'Brands', 'Restaurants', 'Entertainment']
  },
  {
    id: 8,
    name: 'Trafalgar Square',
    category: 'Public Square',
    distance: '1.3 km',
    description: 'Historic public space with fountains & galleries',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop',
    rating: 4.6,
    visitors: '30K+',
    highlights: ['Photography', 'Events', 'Street Performers', 'Galleries']
  },
  {
    id: 9,
    name: 'Manchester Piccadilly',
    category: 'Railway Station',
    distance: '335 km',
    description: 'Main railway station in Manchester city centre',
    image: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=400&h=300&fit=crop',
    rating: 4.5,
    visitors: '25K+',
    highlights: ['WiFi', 'Shops', 'Restaurants', 'City Access']
  },
  {
    id: 10,
    name: 'Manchester Cathedral',
    category: 'Historical Landmark',
    distance: '336 km',
    description: 'Medieval cathedral in the heart of Manchester',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=300&fit=crop',
    rating: 4.7,
    visitors: '18K+',
    highlights: ['History', 'Architecture', 'Tours', 'Events']
  },
  {
    id: 11,
    name: 'Manchester Museum',
    category: 'Museum',
    distance: '338 km',
    description: 'University museum with natural history collections',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b767b915?w=400&h=300&fit=crop',
    rating: 4.6,
    visitors: '20K+',
    highlights: ['Free Entry', 'Exhibitions', 'Dinosaurs', 'Egyptian']
  },
  {
    id: 12,
    name: 'Old Trafford',
    category: 'Sports Stadium',
    distance: '340 km',
    description: 'Home of Manchester United Football Club',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop',
    rating: 4.8,
    visitors: '35K+',
    highlights: ['Stadium Tours', 'Museum', 'Shop', 'Match Days']
  },
  {
    id: 13,
    name: 'Birmingham New Street',
    category: 'Railway Station',
    distance: '190 km',
    description: 'Major railway hub in Birmingham city centre',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
    rating: 4.4,
    visitors: '22K+',
    highlights: ['Shopping', 'WiFi', 'Restaurants', 'Transport Links']
  },
  {
    id: 14,
    name: 'Edinburgh Waverley',
    category: 'Railway Station',
    distance: '665 km',
    description: 'Historic railway station in Edinburgh city centre',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
    rating: 4.6,
    visitors: '19K+',
    highlights: ['Historic Building', 'WiFi', 'City Views', 'Shopping']
  },
  {
    id: 15,
    name: 'Liverpool Lime Street',
    category: 'Railway Station',
    distance: '285 km',
    description: 'Main railway station serving Liverpool',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop',
    rating: 4.5,
    visitors: '17K+',
    highlights: ['WiFi', 'Shops', 'City Centre', 'Transport Hub']
  }
];

const slice = createSlice({
  name: 'destinations',
  initialState: { 
    destinations: mockDestinations,
    favoriteDestinations: [],
    search: '',
    searchResults: [],
    loading: false
  },
  reducers: {
    searchDestinations: (state, action) => {
      const query = action.payload.toLowerCase();
      state.search = action.payload;
      state.searchResults = state.destinations.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      );
    },
    clearSearch: (state) => {
      state.search = '';
      state.searchResults = [];
    },
    addFavoriteDestination: (state, action) => {
      const id = action.payload;
      if (!state.favoriteDestinations.includes(id)) {
        state.favoriteDestinations.push(id);
      }
    },
    removeFavoriteDestination: (state, action) => {
      state.favoriteDestinations = state.favoriteDestinations.filter(id => id !== action.payload);
    }
  }
});

export const { searchDestinations, clearSearch, addFavoriteDestination, removeFavoriteDestination } = slice.actions;
export default slice.reducer;
