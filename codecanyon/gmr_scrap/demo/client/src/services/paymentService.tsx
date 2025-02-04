import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

interface IBuyCoins {
  amount: number;
  url?: string;
  error?: string;
}

export const buyCoins = async (uid: string, amount: number) => {
  const collectionRef = collection(firestore, `users/${uid}/buyCoins`);
  const docRef = await addDoc(collectionRef, {
    amount,
  });

  return docRef.id;
};

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

export const receiptData = ({
  uid,
  receiptId,
  type,
}: {
  uid?: string;
  receiptId?: string;
  type?: string[];
}): Observable<any[]> => {
  const collectionRef = collection(firestore, `payments`);
  const receiptData$ = new BehaviorSubject([] as any[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      ...(uid ? [where("metadata.userId", "==", uid)] : []),
      ...(type ? [where("type", "in", type)] : []),
      ...(receiptId ? [where("key", "array-contains", receiptId)] : []),
      orderBy("createdAt", "desc"),
    ),
    (snapshot) => {
      const historyData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          number: data.id,
          id: doc.id,
        };
      });
      receiptData$.next(historyData);
    },
  );

  return new Observable<any[]>((subscriber) => {
    const subscription = receiptData$.subscribe(subscriber);
    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  });
};
