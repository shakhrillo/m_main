import {
  addDoc,
  collection,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";
import { IPaymentsQuery } from "../types/paymentsQuery";

interface IBuyCoins {
  amount: number;
  url?: string;
  error?: string;
}

export const buyCoins = async (uid: string, amount: number, cost: number) => {
  const collectionRef = collection(firestore, `users/${uid}/buyCoins`);
  const docRef = await addDoc(collectionRef, {
    amount,
    cost,
  });

  return docRef.id;
};

/**
 * Get the buy coins data.
 * @param documentId - The document ID.
 * @param uid - The user ID.
 * @returns The buy coins data.
 */
export const buyCoinsData = (documentId: string, uid: string) => {
  const docRef = doc(firestore, `users/${uid}/buyCoins/${documentId}`);
  const buyCoins$ = new BehaviorSubject({
    amount: 0,
  });

  const unsubscribe = onSnapshot(docRef, (doc) => {
    const data = doc.data() as IBuyCoins;
    if (data) {
      buyCoins$.next(data);
    }
  });

  return new Observable<IBuyCoins>((subscriber) => {
    const subscription = buyCoins$.subscribe(subscriber);
    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  });
};

export const paymentData = (receiptId: string) => {
  const collectionRef = collection(firestore, `payments`);
  const paymentData$ = new BehaviorSubject({} as any);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("id", "==", receiptId)),
    (snapshot) => {
      const paymentData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      paymentData$.next(paymentData[0]);
    },
  );

  return new Observable<{}>((subscriber) => {
    const subscription = paymentData$.subscribe(subscriber);
    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  });
};

export const paymentsData = (q: IPaymentsQuery, lastRef?: any) => {
  const paymentsData$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(
    null as any,
  );
  const collectionRef = collection(firestore, "payments");

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(10),
      ...(lastRef ? [startAfter(lastRef)] : []),
      ...(q.uid ? [where("metadata.userId", "==", q.uid)] : []),
      ...(q.type ? [where("type", "in", q.type)] : []),
      ...(q.receiptId ? [where("key", "array-contains", q.receiptId)] : []),
    ),
    (snapshot) => paymentsData$.next(snapshot),
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    const subscription = paymentsData$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
