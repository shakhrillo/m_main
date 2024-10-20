import { createSlice } from "@reduxjs/toolkit";
import { initFirebase } from "./actions";

const initialState = {
  db: null as any,
  fsapp: null as any,
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initFirebase.fulfilled, (state, action) => {
      console.log('Firebase initialized', action.payload);
      state.db = action.payload.db;
      state.fsapp = action.payload.fsapp;
    });
  }
});

export default firebaseSlice.reducer;