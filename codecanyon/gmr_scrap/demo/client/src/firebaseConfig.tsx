import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_APP_ID}`,
  measurementId: `${import.meta.env.VITE_FIREBASE_MEASUREMENT_ID}`,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage(app);

if (import.meta.env.VITE_ENV === "development") {
  connectAuthEmulator(
    auth,
    `http://localhost:${import.meta.env.VITE_FIREBASE_EMULATOR_AUTHENTICATION}`,
  );
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectStorageEmulator(
    storage,
    "localhost",
    import.meta.env.VITE_FIREBASE_EMULATOR_STORAGE,
  );
}

export { app, auth, firestore, storage };
