import { createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const initFirebase = createAsyncThunk('firebase/initFirebase', async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCVMAJ7QdZYcUZ2G8zyBrHP5q7iZvbmM8o",
    authDomain: "map-review-scrap.firebaseapp.com",
    projectId: "map-review-scrap",
    storageBucket: "map-review-scrap.appspot.com",
    messagingSenderId: "348810635690",
    appId: "1:348810635690:web:db2f887e347b93297ae3d3"
  };

  
  const fsapp = initializeApp(firebaseConfig);
  const db = getFirestore(fsapp);
  // Emulator
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099');

  // firestore emulator
  connectFirestoreEmulator(db, 'localhost', 8282);

  return {
    fsapp,
    db
  }
})

export { initFirebase }