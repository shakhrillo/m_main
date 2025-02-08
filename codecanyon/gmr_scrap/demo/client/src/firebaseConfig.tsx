import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.json";

const app = initializeApp({
  ...firebaseConfig,
  ...(import.meta.env.VITE_APP_ENVIRONMENT === "development" && {
    projectId: `demo-${import.meta.env.VITE_APP_FIREBASE_PROJECT_ID}`,
  }),
});
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage(app);

if (import.meta.env.VITE_APP_ENVIRONMENT === "development") {
  connectAuthEmulator(
    auth,
    `http://localhost:${import.meta.env.VITE_APP_FIREBASE_EMULATOR_AUTHENTICATION}`,
  );
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectStorageEmulator(
    storage,
    "localhost",
    import.meta.env.VITE_APP_FIREBASE_EMULATOR_STORAGE,
  );
}

export { app, auth, firestore, storage };
