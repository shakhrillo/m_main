// src/firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCVMAJ7QdZYcUZ2G8zyBrHP5q7iZvbmM8o",
  authDomain: "map-review-scrap.firebaseapp.com",
  projectId: "map-review-scrap",
  storageBucket: "map-review-scrap.appspot.com",
  messagingSenderId: "348810635690",
  appId: "1:348810635690:web:db2f887e347b93297ae3d3",
}

const app = initializeApp(firebaseConfig)
const auth: Auth = getAuth(app)
const firestore: Firestore = getFirestore(app)

export { auth, firestore, app }
