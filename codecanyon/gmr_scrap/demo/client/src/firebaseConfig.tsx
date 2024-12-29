import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
console.log("firebaseConfig.tsx")
console.log(import.meta.env)
const environment = import.meta.env.VITE_ENV
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const appId = import.meta.env.VITE_FIREBASE_APP_ID
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firestore = getFirestore()

console.log("environment", environment)

if (environment === "development") {
  connectAuthEmulator(
    auth,
    `http://localhost:${import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT}`,
  )
  connectFirestoreEmulator(
    firestore,
    "localhost",
    import.meta.env.VITE_FIRESTORE_EMULATOR_PORT,
  )
}

export { app, auth, firestore }
