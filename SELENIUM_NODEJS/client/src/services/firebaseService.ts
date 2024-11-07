import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from '../firebaseConfig';

export const login = async (email: string, password: string) => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }
  if (!email || !password) {
    return new Promise((resolve, reject) => reject('Email and password are required'))
  }

  await signInWithEmailAndPassword(auth, email, password)
}

export const googleLogin = async () => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }

  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export const register = async (email: string, password: string, firstName: string, lastName: string) => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }
  if (!email || !password || !firstName || !lastName) {
    return new Promise((resolve, reject) => reject('All fields are required'))
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: `${firstName} ${lastName}`});
}

export const logout = async () => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }

  await auth.signOut()
}

export const resetPassword = async (email: string) => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }

  await sendPasswordResetEmail(auth, email);
}

export const checkAuth = async () => {
  if (!auth) {
    return new Promise((resolve, reject) => reject('Firebase auth is not available'))
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}