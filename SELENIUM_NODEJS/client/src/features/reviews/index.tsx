import { createSlice } from "@reduxjs/toolkit";
import { loadReviews } from "./action";

const initialState = {
  reviews: null as any,
  loading: false,
  error: null as any
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(loadReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  }
});

export default reviewsSlice.reducer;