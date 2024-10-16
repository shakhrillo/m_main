import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth';
import firebaseSlice from '../features/firebase';
import reviewsSlice from '../features/reviews';

export const store = configureStore({
  reducer: {
    firebase: firebaseSlice,
    reviews: reviewsSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
