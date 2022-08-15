import { configureStore } from '@reduxjs/toolkit';
import measurementReducer from './slices/measurementSlice';

const store = configureStore({
	reducer: {
		measurements: measurementReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
