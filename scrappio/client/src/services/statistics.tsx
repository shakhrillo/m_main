import { doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";

/**
 * Get statistics from firestore.
 * @param type string
 * @returns Observable<any>
 */
export const getStatistics = (type: string) => {
  const docRef = doc(firestore, `statistics/${type}`);
  const statistics$ = new BehaviorSubject({} as any);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    const data = doc.data() || {};
    statistics$.next(data);
  });

  return new Observable<any>((subscriber) => {
    const subscription = statistics$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
