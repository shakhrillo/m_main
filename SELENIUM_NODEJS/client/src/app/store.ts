import { configureStore } from '@reduxjs/toolkit';
import reviewsSlice from '../features/reviews';

export const store = configureStore({
  reducer: {
    reviews: reviewsSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
