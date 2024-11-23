// src/firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth"
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore"

// const firebaseConfig = {
//   apiKey: "AIzaSyCVMAJ7QdZYcUZ2G8zyBrHP5q7iZvbmM8o",
//   authDomain: "map-review-scrap.firebaseapp.com",
//   projectId: "map-review-scrap",
//   storageBucket: "map-review-scrap.appspot.com",
//   messagingSenderId: "348810635690",
//   appId: "1:348810635690:web:db2f887e347b93297ae3d3",
// }

const app = initializeApp({
  apiKey: "fake-api-key", // This can be any string when using the emulator
  authDomain: "localhost", // Optional for emulator
  projectId: "demo-project-id", // Required for Firestore emulator
  storageBucket: "map-review-scrap.appspot.com",
})
const auth: Auth = getAuth()
const firestore: Firestore = getFirestore()

connectFirestoreEmulator(firestore, "localhost", 9100)
connectAuthEmulator(auth, "http://localhost:9099")

export { auth, firestore, app }
