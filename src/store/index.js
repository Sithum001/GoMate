import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';
import favReducer from './slices/favouritesSlice';
import themeReducer from './slices/themeSlice';
import usersReducer from './slices/usersSlice';
import schedulesReducer from './slices/schedulesSlice';
import destinationsReducer from './slices/destinationsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
  auth: authReducer,
  items: itemsReducer,
  favourites: favReducer,
  theme: themeReducer,
  users: usersReducer,
  schedules: schedulesReducer,
  destinations: destinationsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'favourites', 'theme', 'users'],
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export default store;
