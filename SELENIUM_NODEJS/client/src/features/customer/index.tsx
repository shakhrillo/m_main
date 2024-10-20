import { createSlice } from "@reduxjs/toolkit";
import { loadCustomer, loadCustomerPayments, loadCustomerSubscriptions } from "./action";

const initialState = {
  customer: {} as any,
  payments: [] as any[],
  subscriptions: [] as any[]
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCustomer.fulfilled, (state, action) => {
      state.customer = action.payload
    });
    builder.addCase(loadCustomerSubscriptions.fulfilled, (state, action) => {
      state.subscriptions = action.payload
    });
    builder.addCase(loadCustomerPayments.fulfilled, (state, action) => {
      state.payments = action.payload
    });
  }
});

export default customerSlice.reducer;