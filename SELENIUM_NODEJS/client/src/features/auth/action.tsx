import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updatePassword } from "firebase/auth";

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
  console.log("Signing in with Google");
  const auth = getAuth();
  console.log("Auth:", auth);
  return signInWithPopup(auth, new GoogleAuthProvider());
});

const signOutAction = createAsyncThunk('auth/signOut', async () => {
  const auth = getAuth();
  return auth.signOut()
});

const updateAccountPasswordAction = createAsyncThunk('auth/updateAccountPassword', async (payload: { password: string }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    return null
  }

  return await updatePassword(user, payload.password);
});

const deleteAccountAction = createAsyncThunk('auth/deleteAccount', async () => {
  const auth = getAuth();
  return auth.currentUser?.delete()
});

const getUserTokenAction = createAsyncThunk('auth/getUserToken', async () => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken()
});

export { registerEmailAndPasswordAction, signInEmailAndPasswordAction, signOutAction, signInWithGoogleAction, deleteAccountAction, updateAccountPasswordAction, getUserTokenAction };
