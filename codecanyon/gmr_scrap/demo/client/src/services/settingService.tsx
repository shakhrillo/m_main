import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

const startDate: Date = new Date();
startDate.setMonth(startDate.getMonth() - 3);

export const allUsers = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "users");
  const users$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("createdAt", ">", fromDate)),
    (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      users$.next(usersData);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = users$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const totalEarnings = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "earnings");
  const earnings$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("createdAt", ">", fromDate)),
    (snapshot) => {
      const earningsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      earnings$.next(earningsData);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = earnings$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
