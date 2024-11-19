import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from './slice/userSlice';
import profileSlice from './slice/profileSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'profile']
};

const userReducer = persistReducer(persistConfig, userSlice);
const profileReducer = persistReducer(persistConfig, profileSlice);

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

const persistor = persistStore(store);  

export { store, persistor };
