import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const registerEmailAndPasswordAction = createAsyncThunk('auth/registerEmailAndPassword', async (payload: { email: string, password: string }) => {
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    return auth
  } catch (error) {
    console.error("Error registering:", error);
    return null
  }
});

const signInEmailAndPasswordAction = createAsyncThunk('auth/signInEmailAndPassword', async (payload: { email: string, password: string }) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, payload.email, payload.password);
    return auth
  } catch (error) {
    console.error("Error signing in:", error);
    return null
  }
});

const signInWithGoogleAction = createAsyncThunk('auth/signInWithGoogle', async () => {
  const auth = getAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
});

const signOutAction = createAsyncThunk('auth/signOut', async () => {
  const auth = getAuth();
  return auth.signOut()
});

export { registerEmailAndPasswordAction, signInEmailAndPasswordAction, signOutAction, signInWithGoogleAction };
