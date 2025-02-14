import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { auth, firestore } from "../firebaseConfig";
import { User } from "firebase/auth";
import { IUserInfo } from "../types/userInfo";

/**
 * Get the authenticated user.
 * @returns Promise<User | null>
 */
export const authenticatedUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resolve(user);
      unsubscribe();
    });
  });
};

/**
 * Get the user data.
 * @param uid The user ID.
 * @returns Observable<IUserInfo>
 */
export const userData = (uid: string): Observable<IUserInfo | null> => {
  const docCollection = collection(firestore, "users");
  const user$ = new BehaviorSubject<IUserInfo | null>(null);

  const unsubscribe = onSnapshot(
    query(docCollection, where("uid", "==", uid)),
    (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as IUserInfo;
        user$.next(data);
      });
    },
    (error) => {
      console.error("Error fetching user data:", error);
      user$.error(error);
    },
  );

  return new Observable<IUserInfo>((subscriber) => {
    const subscription = user$.pipe(filter((user) => user !== null)).subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const updateUser = (
  id: string,
  data: Partial<IUserInfo>,
): Promise<void> => {
  const docRef = doc(firestore, "users", id);
  return updateDoc(docRef, data);
};
