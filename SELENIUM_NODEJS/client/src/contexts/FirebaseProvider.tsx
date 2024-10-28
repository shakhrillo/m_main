// src/contexts/FirebaseProvider.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Auth, GoogleAuthProvider, User, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

interface FirebaseContextProps {
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  const logout = async () => {
    await signOut(auth);
  };

  const firebaseServices = { auth, firestore, user, login, googleLogin, logout };

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextProps => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
