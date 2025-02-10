import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
import { IComment } from "./scrapService";

export const reviewComments = (
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
  const collectionRef = collection(firestore, `reviews`);
  const reviews$ = new BehaviorSubject([] as IComment[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      // orderBy("createdAt", "asc"),
      where("machineId", "==", placeId),
      where("uid", "==", uid),
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

export const reviewImages = (
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
  const collectionRef = collection(firestore, `images`);
  const reviews$ = new BehaviorSubject([] as IComment[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      where("machineId", "==", placeId),
      where("uid", "==", uid),
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

export const reviewVideos = (
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
  const collectionRef = collection(firestore, `videos`);
  const reviews$ = new BehaviorSubject([] as IComment[]);

  console.log("placeid", placeId);
  console.log("uid", uid);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      where("machineId", "==", placeId),
      where("uid", "==", uid),
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
