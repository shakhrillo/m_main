import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

export const allUsers = () => {
  const collectionRef = collection(firestore, "users");
  const users$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const usersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    users$.next(usersData);
  });

  return new Observable<any>((subscriber) => {
    const subscription = users$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
