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
  checkAuth: () => Promise<any>;
  isLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('user', user);
        user?.getIdToken().then((token) => {
          console.log('token', token);
        })
        setIsLoading(false);
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  const logout = async () => {
    await signOut(auth);
  };

  const firebaseServices = { auth, firestore, isLoading, checkAuth, user, login, googleLogin, logout };

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
