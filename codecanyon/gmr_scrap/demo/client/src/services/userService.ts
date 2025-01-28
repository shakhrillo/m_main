import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { auth, firestore } from "../firebaseConfig";
import { User } from "firebase/auth";
import { UserInfo } from "../types/userInfo";

export interface IUser {
  photoURL?: string;
  displayName?: string;
  uid?: string;
  coinBalance?: string;
  notifications?: { id: string; title: string }[];
  newNotifications?: number;
}

export const authenticatedUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resolve(user);
      unsubscribe();
    });
  });
};

export const userData = (uid: string): Observable<IUser> => {
  const docRef = doc(firestore, "users", uid);
  const user$ = new BehaviorSubject<IUser>({});

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() || {};
        user$.next(data);
      } else {
        user$.next({});
      }
    },
    (error) => {
      console.error("Error fetching user data:", error);
      user$.error(error);
    },
  );

  return new Observable<IUser>((subscriber) => {
    const subscription = user$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const updateUser = (
  id: string,
  data: Partial<UserInfo>,
): Promise<void> => {
  const docRef = doc(firestore, "users", id);
  return updateDoc(docRef, data);
};
