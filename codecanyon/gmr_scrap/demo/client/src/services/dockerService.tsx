import { collection, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";

export const allContainers = () => {
  const containers$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "machines");

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const containersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("containersData", containersData);
      containers$.next(containersData);
    },
    (error) => {
      console.error("Error fetching containers data:", error);
      containers$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = containers$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
