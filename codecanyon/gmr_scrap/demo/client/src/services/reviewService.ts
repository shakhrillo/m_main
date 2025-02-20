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
interface IReviewQuery {
  uid?: string;
  reviewId?: string;
  filterOptions?: "onlyImages" | "onlyVideos" | "onlyQA" | "onlyResponse" | string;
  search?: string;
}

export const reviewsData = (type: 'reviews' | 'images' | 'videos', q: IReviewQuery = {}, lastRef?: any) => {
  const reviews$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(null as any);
  const collectionRef = collection(firestore, `containers/${q.reviewId}/${type}`);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      where("uid", "==", q.uid),
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
