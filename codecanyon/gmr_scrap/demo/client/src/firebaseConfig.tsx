import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAic1Mo91OQaofpFE8VISIAmvZ1azQ-lmc",
  projectId: import.meta.env.VITE_FIREBASE_APP_ID || "test",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    `${import.meta.env.VITE_FIREBASE_APP_ID}.firebasestorage.app`,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    `${import.meta.env.VITE_FIREBASE_APP_ID}.firebaseapp.com`,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 668777922282,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "test",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y0Y82432TG",
};

console.log("firebaseConfig", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
// const firestore = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
//   useFetchStreams: false,
// });
const storage = getStorage(app);

if (import.meta.env.VITE_ENV === "development") {
  console.log(
    "connectAuthEmulator",
    import.meta.env.VITE_FIREBASE_EMULATOR_AUTHENTICATION,
  );
  connectAuthEmulator(
    auth,
    `http://0.0.0.0:${import.meta.env.VITE_FIREBASE_EMULATOR_AUTHENTICATION}`,
  );

  console.log(
    "connectFirestoreEmulator",
    import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE,
  );
  connectFirestoreEmulator(
    firestore,
    "http://0.0.0.0",
    import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE,
  );

  console.log(
    "connectStorageEmulator",
    import.meta.env.VITE_FIREBASE_EMULATOR_STORAGE,
  );
  connectStorageEmulator(
    storage,
    "0.0.0.0",
    import.meta.env.VITE_FIREBASE_EMULATOR_STORAGE,
  );
}

export { app, auth, firestore, storage };
