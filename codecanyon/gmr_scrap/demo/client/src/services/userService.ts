import type {
  DocumentData,
  QuerySnapshot} from "firebase/firestore";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { auth, firestore } from "../firebaseConfig";
import type { User } from "firebase/auth";
import type { IUserInfo } from "../types/userInfo";

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
export const userData = (uid: string) => {
  const user$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(null as any);
  const collectionRef = collection(firestore, "users");

  const unsubscribe = onSnapshot(
    query(collectionRef, where("uid", "==", uid)),
    (snapshot) => user$.next(snapshot),
    (error) => user$.error(error),
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    const subscription = user$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

/**
 * Update the user data.
 * @param id The user ID.
 * @param data The data to update.
 * @returns Promise<void>
 */
export const updateUser = async (
  id: string,
  data: Partial<IUserInfo>,
): Promise<void> => {
  if (!id) throw new Error("User ID is required.");
  if (!data || Object.keys(data).length === 0)
    throw new Error("Update data cannot be empty.");

  try {
    const docRef = doc(firestore, "users", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }
};
