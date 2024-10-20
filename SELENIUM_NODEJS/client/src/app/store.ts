import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth';
import customerSlice from '../features/customer';
import firebaseSlice from '../features/firebase';
import productsSlice from '../features/products';
import reviewsSlice from '../features/reviews';

export const store = configureStore({
  reducer: {
    firebase: firebaseSlice,
    reviews: reviewsSlice,
    auth: authSlice,
    products: productsSlice,
    customer: customerSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
