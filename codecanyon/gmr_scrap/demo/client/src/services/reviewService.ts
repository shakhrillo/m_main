import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
interface IReviewQuery {
  uid?: string;
  reviewId?: string;
  filterOptions?:
    | "onlyImages"
    | "onlyVideos"
    | "onlyQA"
    | "onlyResponse"
    | string;
  search?: string;
}

/**
 * Get the reviews data.
 * @param type - The type of reviews.
 * @param q - The query.
 * @param lastRef - The last reference.
 * @returns The reviews data.
 */
export const reviewsData = (
  type: "reviews" | "images" | "videos",
  q: IReviewQuery = {},
  lastRef?: any,
) => {
  const reviews$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(
    null as any,
  );
  const collectionRef = collection(
    firestore,
    `containers/${q.reviewId}/${type}`,
  );

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      ...(q.uid ? [where("uid", "==", q.uid)] : []),
      ...(q.filterOptions ? [where(q.filterOptions, ">", [])] : []),
      ...(q.search ? [where("keywords", "array-contains", q.search)] : []),
      ...(lastRef ? [startAfter(lastRef)] : []),
      limit(10),
    ),
    (snapshot) => reviews$.next(snapshot),
    (error) => {
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
