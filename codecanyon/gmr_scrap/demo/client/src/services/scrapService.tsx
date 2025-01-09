import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

export interface IReview {
  address: string;
  createdAt: Timestamp;
  extendedUrl: string;
  location: string;
  rating: number;
  reviewId: string;
  reviews: number;
  screenshot: string;
  title: string;
  type: string;
  updatedAt: Timestamp;
  url: string;
  userId: string;

  limit?: number;
  sortBy?: string;
  extractImageUrls?: boolean;
  extractVideoUrls?: boolean;
  extractOwnerResponse?: boolean;
  status?: string;
}

export const validateUrl = async (url: string, uid: string) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const documentRef = await addDoc(collectionRef, {
    url,
    type: "info",
  });

  return documentRef.id;
};

export const validateUrlData = (documentId: string, uid: string) => {
  const docRef = doc(firestore, `users/${uid}/reviews/${documentId}`);
  const review$ = new BehaviorSubject<IReview>({
    address: "",
    createdAt: Timestamp.now(),
    extendedUrl: "",
    location: "",
    rating: 0,
    reviewId: "",
    reviews: 0,
    screenshot: "",
    title: "",
    type: "",
    updatedAt: Timestamp.now(),
    url: "",
    userId: "",
  });

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() || {};
        review$.next(data as IReview);
      } else {
        review$.next({
          address: "",
          createdAt: Timestamp.now(),
          extendedUrl: "",
          location: "",
          rating: 0,
          reviewId: "",
          reviews: 0,
          screenshot: "",
          title: "",
          type: "",
          updatedAt: Timestamp.now(),
          url: "",
          userId: "",
        });
      }
    },
    (error) => {
      console.error("Error fetching review data:", error);
      review$.error(error);
    },
  );

  return new Observable<IReview>((subscriber) => {
    const subscription = review$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const startScrap = async (uid: string, data: IReview) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const documentRef = await addDoc(collectionRef, data);

  return documentRef.id;
};

export const scrapsData = (uid: string) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const scraps$ = new BehaviorSubject([] as IReview[]);

  const unsubscribe = onSnapshot(
    query(collectionRef, orderBy("createdAt", "desc")),
    (snapshot) => {
      const scrapsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        reviewId: doc.id,
      })) as IReview[];
      scraps$.next(scrapsData);
    },
    (error) => {
      console.error("Error fetching scraps data:", error);
      scraps$.error(error);
    },
  );

  return new Observable<IReview[]>((subscriber) => {
    const subscription = scraps$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const scrapStatistics = (uid: string) => {
  const docRef = doc(firestore, `users/${uid}/settings/statistics`);
  const stats$ = new BehaviorSubject({});

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      const data = doc.data() || {};
      stats$.next(data);
    },
    (error) => {
      console.error("Error fetching stats data:", error);
      stats$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = stats$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
