import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import firebaseConfig from "../firebaseConfig.json";

const host = "127.0.0.1";
const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT;
const APP_FIREBASE_PROJECT_ID = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID;
const APP_FIREBASE_EMULATOR_AUTHENTICATION = import.meta.env
  .VITE_APP_FIREBASE_EMULATOR_AUTHENTICATION;
const APP_FIREBASE_EMULATOR_FIRESTORE = import.meta.env
  .VITE_APP_FIREBASE_EMULATOR_FIRESTORE;
const APP_FIREBASE_EMULATOR_STORAGE = import.meta.env
  .VITE_APP_FIREBASE_EMULATOR_STORAGE;

console.log(import.meta.env)

const app = initializeApp({
  ...firebaseConfig,
  ...(APP_ENVIRONMENT === "development" && {
    projectId: `demo-${APP_FIREBASE_PROJECT_ID}`,
  }),
});

const auth = getAuth(app);
if (APP_ENVIRONMENT === "development") {
  try {
    connectAuthEmulator(
      auth,
      `http://${host}:${APP_FIREBASE_EMULATOR_AUTHENTICATION}`,
    );
  } catch (error) {
    console.error(error);
  }
}

const firestore = getFirestore(app);
if (APP_ENVIRONMENT === "development") {
  try {
    connectFirestoreEmulator(firestore, host, APP_FIREBASE_EMULATOR_FIRESTORE);
  } catch (error) {
    console.error(error);
  }
}

const storage = getStorage(app);
if (APP_ENVIRONMENT === "development") {
  try {
    connectStorageEmulator(storage, host, APP_FIREBASE_EMULATOR_STORAGE);
  } catch (error) {
    console.error(error);
  }
}

export { app, auth, firestore, storage };
