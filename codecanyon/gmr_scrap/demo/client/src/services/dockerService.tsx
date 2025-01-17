import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";

export const allContainers = () => {
  const containers$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "machines");

  const unsubscribe = onSnapshot(
    query(collectionRef, orderBy("updatedAt", "desc")),
    (snapshot) => {
      const containersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("containersData", containersData);
      containers$.next(containersData);
    },
    (error) => {
      console.error("Error fetching containers data:", error);
      containers$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = containers$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const dockerContainerStats = (containerId: string) => {
  const stats$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "machines", containerId, "stats");

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const statsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("statsData", statsData);
      stats$.next(statsData);
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

export const allImages = () => {
  const images$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "images");

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

export const dockerImage = (imgId: string) => {
  const image$ = new BehaviorSubject({} as any);
  const docRef = doc(firestore, "images", imgId);

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      const imageData = {
        id: doc.id,
        ...doc.data(),
      };
      console.log("imageData", imageData);
      image$.next(imageData);
    },
    (error) => {
      console.error("Error fetching image data:", error);
      image$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = image$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const dockerImageLayers = (imgId: string) => {
  const image$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "images", imgId, "layers");

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const layersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("layersData", layersData);
      image$.next(layersData);
    },
    (error) => {
      console.error("Error fetching layers data:", error);
      image$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = image$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const dockerImageDetails = (imgId: string) => {
  const details$ = new BehaviorSubject({} as any);
  const collectionRef = collection(firestore, "images", imgId, "details");

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const detailsData =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) || [];

      details$.next(detailsData[0] || {});
    },
    (error) => {
      console.error("Error fetching details data:", error);
      details$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = details$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
