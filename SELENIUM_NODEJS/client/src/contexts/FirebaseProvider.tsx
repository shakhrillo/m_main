import { Auth, onAuthStateChanged, User } from "firebase/auth"
import { Firestore } from "firebase/firestore"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { auth, firestore } from "../firebaseConfig"

interface FirebaseContextProps {
  auth: Auth
  firestore: Firestore
  user: User | null
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null)

interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  const firebaseServices = { auth, firestore, user }

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = (): FirebaseContextProps => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
