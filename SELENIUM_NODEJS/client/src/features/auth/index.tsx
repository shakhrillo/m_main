import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null as any
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log('action.payload', action.payload);
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;