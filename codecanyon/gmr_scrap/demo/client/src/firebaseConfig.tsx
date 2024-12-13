// src/firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"

// Firebase configuration
const prodConfig = {
  apiKey: "AIzaSyAic1Mo91OQaofpFE8VISIAmvZ1azQ-lmc",
  authDomain: "fir-scrapp.firebaseapp.com",
  projectId: "fir-scrapp",
  storageBucket: "fir-scrapp.firebasestorage.app",
  messagingSenderId: "668777922282",
  appId: "1:668777922282:web:b0fedff7b583523b13a193",
  measurementId: "G-Y0Y82432TG",
}

const devConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "fir-scrapp",
  storageBucket: "map-review-scrap.appspot.com",
}

// Emulator configuration
const EMULATOR_CONFIG = {
  auth: "http://127.0.0.1:9099",
  firestore: { host: "127.0.0.1", port: 9100 },
}

// Firebase initialization
const isProduction = process.env.NODE_ENV === "production"
const firebaseConfig = isProduction ? prodConfig : devConfig

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firestore = getFirestore()

// Connect to emulators in development mode
if (!isProduction) {
  connectAuthEmulator(auth, EMULATOR_CONFIG.auth)
  connectFirestoreEmulator(
    firestore,
    EMULATOR_CONFIG.firestore.host,
    EMULATOR_CONFIG.firestore.port,
  )
}

export { app, auth, firestore }
