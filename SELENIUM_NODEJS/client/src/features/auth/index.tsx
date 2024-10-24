import { createSlice } from "@reduxjs/toolkit";
import { registerEmailAndPasswordAction, signInEmailAndPasswordAction, signInWithGoogleAction, signOutAction, updateAccountPasswordAction, deleteAccountAction, getUserTokenAction } from "./action";

const initialState = {
  user: null as any,
  token: null as any,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerEmailAndPasswordAction.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(signInEmailAndPasswordAction.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(signInWithGoogleAction.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(signOutAction.fulfilled, (state, action) => {
      state.user = null;
    });
    builder.addCase(updateAccountPasswordAction.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(deleteAccountAction.fulfilled, (state, action) => {
      state.user = null;
    });
    builder.addCase(getUserTokenAction.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;