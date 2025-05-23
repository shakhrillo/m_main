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
import type { IComment } from "../types/comment";
import type { IReview } from "../types/review";

/**
 * Validate URL
 * @param url
 * @param uid
 * @returns documentId
 */
export const validateUrl = async (url: string, uid: string) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const documentRef = await addDoc(collectionRef, {
    url,
    type: "info",
  });

  return documentRef.id;
};

/**
 * Validate URL Data
 * @param documentId
 * @param uid
 * @returns Review Data
 */
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

/**
 * Validate URL Data
 * @param uid
 * @param type
 * @param search
 * @param filter
 * @returns Review Data
 */
export const validatedUrls = (
  uid: string,
  {
    type = "info",
    search = "",
    filter = "",
  }: {
    type: "info" | "comments";
    search?: string;
    filter?: string;
  },
) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const scraps$ = new BehaviorSubject([] as IReview[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("type", "==", type),
      ...(search ? [where("keywords", "array-contains", search)] : []),
      ...(filter ? [where("status", "==", filter)] : []),
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

/**
 * Start Scrap
 * @param uid
 * @param data
 * @returns documentId
 */
export const startScrap = async (uid: string, data: IReview) => {
  const collectionRef = collection(firestore, `users/${uid}/reviews`);
  const documentRef = await addDoc(collectionRef, data);

  return documentRef.id;
};

export const scrapData = (
  placeId: string,
  uid: string,
  filterOptions: {
    onlyImages: boolean;
    onlyVideos: boolean;
    onlyQA: boolean;
    onlyResponse: boolean;
  },
  search: string,
) => {
  const collectionRef = collection(
    firestore,
    `users/${uid}/reviews/${placeId}/reviews`,
  );
  const reviews$ = new BehaviorSubject([] as IComment[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("time", "asc"),
      ...(filterOptions.onlyQA ? [where("qa", ">", [])] : []),
      ...(filterOptions.onlyResponse ? [where("response", ">", "")] : []),
      ...(filterOptions.onlyImages ? [where("imageUrls", ">", [])] : []),
      ...(filterOptions.onlyVideos ? [where("videoUrls", ">", [])] : []),
      ...(search ? [where("keywords", "array-contains", search)] : []),
    ),
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

/**
 * Scrap QA
 * @param placeId
 * @param uid
 * @returns QA Data
 */
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

/**
 * Scrap Videos
 * @param placeId
 * @param uid
 * @returns Videos Data
 */
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

/**
 * Scrap QA
 * @param placeId
 * @param uid
 * @returns QA Data
 */
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
