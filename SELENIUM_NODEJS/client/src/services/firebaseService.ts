import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, firestore } from '../firebaseConfig';
import { addDoc, collection, orderBy, query } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

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

export const startExtractGmapReviews = async (
  uid: string,
  data: {
    url: string,
    limit: number,
    sortBy: string,
    extractImageUrls: boolean,
    ownerResponse: boolean,
    onlyGoogleReviews: boolean,
  }
) => {
  const collectionReviews = collection(
    firestore,
    `users/${uid}/reviews`,
  )

  const docRef = await addDoc(collectionReviews, {
    ...data,
    status: "in-progress",
    createdAt: new Date(),
  })

  return docRef.id
}

export const getReviewsQuery = (uid: string) => {
  const collectionReviews = collection(
    firestore,
    `users/${uid}/reviews`,
  )
  const reviewsQuery = query(collectionReviews, orderBy("createdAt", "desc"))
  return reviewsQuery
}

export const downloadFile = async (url: string) => {
  const storage = getStorage()
  const fileRef = ref(storage, url)
  const fileUrl = await getDownloadURL(fileRef)
  return fileUrl
}

export const buyCoins = async (uid: string, amount: number) => {
  if (!firestore || !uid) return
  const collectionRef = collection(
    firestore,
    `users/${uid}/buyCoins`,
  )
  await addDoc(collectionRef, { amount })
}

export const getBuyCoinsQuery = (uid: string) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/buy`,
  )
  return collectionRef
}

export const getPaymentsQuery = (uid: string) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/payments`,
  )
  return query(collectionRef, orderBy("created", "desc"))
}
