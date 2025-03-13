import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { updateUser } from "./userService";

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
 * @returns Promise with user
 */
export const register = async (formData: any) => {
  const { firstName, lastName, email, password } = formData;
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
    await updateUser(user.uid, {
      displayName: `${firstName} ${lastName}`,
    });
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
