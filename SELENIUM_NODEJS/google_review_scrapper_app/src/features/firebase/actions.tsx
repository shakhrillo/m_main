import { createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const initFirebase = createAsyncThunk('firebase/initFirebase', async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAbWEKCv0vFuretjZhtxrrXBHKgTOy-7cE",
    authDomain: "borderline-dev.firebaseapp.com",
    projectId: "borderline-dev",
    storageBucket: "borderline-dev.appspot.com",
    messagingSenderId: "406001897389",
    appId: "1:406001897389:web:bcf2d6fd7ea1b69c749b24",
    measurementId: "G-YJ9H91CHK1"
  };
  
  const fsapp = initializeApp(firebaseConfig);
  const db = getFirestore(fsapp);

  return {
    fsapp,
    db
  }
})

export { initFirebase }