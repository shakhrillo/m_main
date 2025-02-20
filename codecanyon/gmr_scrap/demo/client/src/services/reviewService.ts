import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
import { IComment } from "./scrapService";
interface IReviewQuery {
  uid?: string;
  reviewId?: string;
  // filterOptions?: {
  //   onlyImages?: boolean;
  //   onlyVideos?: boolean;
  //   onlyQA?: boolean;
  //   onlyResponse?: boolean;
  // };
  filterOptions?: "onlyImages" | "onlyVideos" | "onlyQA" | "onlyResponse" | string;
  search?: string;
}
export const reviewComments = (q: IReviewQuery = {}, lastRef?: any) => {
  const reviews$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(null as any);
  const collectionRef = collection(firestore, `containers/${q.reviewId}/reviews`);

  console.log("q", q);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      where("uid", "==", q.uid),
      limit(1),
      ...(lastRef ? [startAfter(lastRef)] : []),
      ...(q.filterOptions ? [where(q.filterOptions, ">", [])] : []),
      ...(q.search ? [where("keywords", "array-contains", q.search)] : []),
    ),
    (snapshot) => reviews$.next(snapshot),
    (error) => {
      console.log(q)
      console.error("Error fetching reviews data:", error);
      reviews$.error(error);
    },
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
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
  const collectionRef = collection(firestore, `containers/${placeId}/images`);
  const reviews$ = new BehaviorSubject([] as IComment[]);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      // where("machineId", "==", placeId),
      // where("uid", "==", uid),
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
  const collectionRef = collection(firestore, `containers/${placeId}/videos`);
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
