import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import toursSlice from './slices/toursSlice';
import { useDispatch, useSelector, useStore } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tours: toursSlice,
  },
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()