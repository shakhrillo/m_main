import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const login = async (email: string, password: string) =>
  await signInWithEmailAndPassword(auth, email, password);

export const googleLogin = async () =>
  await signInWithPopup(auth, new GoogleAuthProvider());

export const logout = async () => await auth.signOut();
export const register = async (email: string, password: string) =>
  await createUserWithEmailAndPassword(auth, email, password);
