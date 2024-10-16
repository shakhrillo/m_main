import { createSlice } from "@reduxjs/toolkit";
import { signInAnonymouslyAction } from "./action";

const initialState = {
  user: null as any,
  loading: false,
  error: null as any
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signInAnonymouslyAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signInAnonymouslyAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signInAnonymouslyAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  }
});

export default authSlice.reducer;