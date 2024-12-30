import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"

const {
  VITE_ENV,
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID,
  VITE_FIREBASE_AUTH_EMULATOR_PORT,
  VITE_FIRESTORE_EMULATOR_PORT,
} = import.meta.env

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firestore = getFirestore()

if (VITE_ENV === "development") {
  connectAuthEmulator(
    auth,
    `http://localhost:${VITE_FIREBASE_AUTH_EMULATOR_PORT}`,
  )
  connectFirestoreEmulator(firestore, "localhost", VITE_FIRESTORE_EMULATOR_PORT)
}

export { app, auth, firestore }
