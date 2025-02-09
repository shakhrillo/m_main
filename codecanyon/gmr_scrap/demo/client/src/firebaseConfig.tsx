import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.json";

const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || "development";
const APP_FIREBASE_PROJECT_ID =
  import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || "gmrs-6638f";
const APP_FIREBASE_EMULATOR_AUTHENTICATION =
  import.meta.env.VITE_APP_FIREBASE_EMULATOR_AUTHENTICATION || "9099";
const APP_FIREBASE_EMULATOR_FIRESTORE =
  import.meta.env.VITE_APP_FIREBASE_EMULATOR_FIRESTORE || "8080";
const APP_FIREBASE_EMULATOR_STORAGE =
  import.meta.env.VITE_APP_FIREBASE_EMULATOR_STORAGE || "9199";

const app = initializeApp({
  ...firebaseConfig,
  ...(APP_ENVIRONMENT === "development" && {
    projectId: `demo-${APP_FIREBASE_PROJECT_ID}`,
  }),
});
const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage(app);

if (APP_ENVIRONMENT === "development") {
  connectAuthEmulator(
    auth,
    `http://127.0.0.1:${APP_FIREBASE_EMULATOR_AUTHENTICATION}`,
  );
  connectFirestoreEmulator(
    firestore,
    "127.0.0.1",
    APP_FIREBASE_EMULATOR_FIRESTORE,
  );
  connectStorageEmulator(storage, "127.0.0.1", APP_FIREBASE_EMULATOR_STORAGE);
}

export { app, auth, firestore, storage };
