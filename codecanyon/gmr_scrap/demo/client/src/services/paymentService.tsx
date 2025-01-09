import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

interface IBuyCoins {
  amount: number;
  url?: string;
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
    console.log(data);
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
