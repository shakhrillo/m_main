import { createSlice } from "@reduxjs/toolkit";
import { loadProductPrices, loadProducts } from "./actions";

const initialState = {
  products: [] as any[],
  prices: {} as any,
};

const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadProducts.fulfilled, (state, action) => {
      state.products = action.payload
    });
    builder.addCase(loadProductPrices.fulfilled, (state, action) => {
      const productId = action.payload[0].productId || 'default';
      state.prices[productId] = action.payload[0];
    });
  }
});

export default productsSlice.reducer;