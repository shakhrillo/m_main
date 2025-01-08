import { doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
import formatNumber from "../utils/formatCoins";

/**
 * Fetches the coin balance of a user.
 * @param uid The user ID.
 * @returns An observable that emits the user's coin balance.
 */
export const userCoins = (uid: string): Observable<string> => {
  const docRef = doc(firestore, "users", uid);
  const coinBalance$ = new BehaviorSubject<string>("0");

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() || {};
        coinBalance$.next(formatNumber(data.coinBalance));
      } else {
        coinBalance$.next("0");
      }
    },
    (error) => {
      console.error("Error fetching user data:", error);
      coinBalance$.error(error);
    },
  );

  return new Observable<string>((subscriber) => {
    const subscription = coinBalance$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
