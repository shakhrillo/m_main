import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInAnonymously } from "firebase/auth";

const signInAnonymouslyAction = createAsyncThunk('auth/signInAnonymously', async () => {
  const auth = getAuth();
  try {
    await signInAnonymously(auth);
    console.log("Sign in successfully")
    return auth
  } catch (error) {
    console.error("Error signing in:", error);
    return {}
  }
});

export { signInAnonymouslyAction }