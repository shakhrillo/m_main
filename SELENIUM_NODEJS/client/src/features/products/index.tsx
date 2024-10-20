import { createSlice } from "@reduxjs/toolkit";
import { buyProductAction, loadProductPrices, loadProducts } from "./actions";

const initialState = {
  products: [] as any[],
  prices: {} as any,
  purchaseId: "",
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
    builder.addCase(buyProductAction.fulfilled, (state, action) => {
      state.purchaseId = action.payload;
    });
  }
});

export default productsSlice.reducer;