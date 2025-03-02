import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * Login user
 * @param email
 * @param password
 * @returns Promise with user
 */
export const login = async (email: string, password: string) =>
  await signInWithEmailAndPassword(auth, email, password);

/**
 * Login with google
 * @returns Promise with user
 */
export const googleLogin = async () =>
  await signInWithPopup(auth, new GoogleAuthProvider());

/**
 * Logout user
 * @returns Promise
 */ 
export const logout = async () => await auth.signOut();

/**
 * Register user
 * @param email
 * @param password
 * @returns Promise with user
 */
export const register = async (email: string, password: string) =>
  await createUserWithEmailAndPassword(auth, email, password);
