import {
  addDoc,
  collection,
  doc,
  GeoPoint,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

export interface ICommentUser {
  info: string[];
  url: string;
  name: string;
}

export interface IComment {
  date: string;
  id: string;
  imageUrls: { thumb: string; id: string }[];
  qa: string[];
  rating: number;
  response: string;
  review: string;
  time: number; // Need to convert to Timestamp
  user: ICommentUser;
  videoUrls: { videoUrl: string; thumb: string; id: string }[];
}

export interface IReview {
  id?: string;

  address: string;
  createdAt: Timestamp;
  extendedUrl: string;
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

  totalReviews?: number;
  totalImages?: number;
  totalVideos?: number;
  totalOwnerReviews?: number;

  csvUrl?: string;
  jsonUrl?: string;

  location?: GeoPoint;
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
  const review$ = new BehaviorSubject<IReview>({} as IReview);

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() || {};
        review$.next(data as IReview);
      } else {
        review$.next({} as IReview);
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

export const validatedUrls = (uid: string, type = "info") => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const scraps$ = new BehaviorSubject([] as IReview[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("type", "==", type),
    ),
    (snapshot) => {
      const scrapsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
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

export const startScrap = async (uid: string, data: IReview) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const documentRef = await addDoc(collectionRef, data);

  return documentRef.id;
};

export const scrapData = (placeId: string, uid: string) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/reviews/${placeId}/reviews`,
  );
  const reviews$ = new BehaviorSubject([] as IComment[]);

  const unsubscribe = onSnapshot(
    query(collectionRef, orderBy("time", "asc")),
    (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IComment[];
      reviews$.next(reviewsData);
    },
    (error) => {
      console.error("Error fetching reviews data:", error);
      reviews$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = reviews$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const scrapImages = (placeId: string, uid: string) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/reviews/${placeId}/images`,
  );
  const images$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("imagesData", imagesData);
      images$.next(imagesData);
    },
    (error) => {
      console.error("Error fetching images data:", error);
      images$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = images$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const scrapVideos = (placeId: string, uid: string) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/reviews/${placeId}/videos`,
  );
  const videos$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      videos$.next(videosData);
    },
    (error) => {
      console.error("Error fetching videos data:", error);
      videos$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = videos$.subscribe(subscriber);

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
