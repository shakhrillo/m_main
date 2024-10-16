import { createSlice } from "@reduxjs/toolkit";
import { initFirebase } from "./actions";

const initialState = {
  db: null as any,
  loading: false,
  error: null as any
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initFirebase.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initFirebase.fulfilled, (state, action) => {
      state.loading = false;
      state.db = action.payload;
    });
    builder.addCase(initFirebase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  }
});

export default firebaseSlice.reducer;