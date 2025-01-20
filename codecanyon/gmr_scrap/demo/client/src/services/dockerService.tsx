import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
import { IDockerConfig } from "../types/dockerConfig";
import { IDockerContainer } from "../types/dockerContainer";

/**
 * Fetches all docker containers
 * @returns Observable<IDockerContainer[]>
 */
export const dockerContainers = () => {
  const containers$ = new BehaviorSubject<IDockerContainer[]>([]);
  const collectionRef = collection(firestore, "machines");

  const unsubscribe = onSnapshot(
    query(collectionRef, orderBy("time", "desc")),
    (snapshot) => {
      const containersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      containers$.next(containersData as IDockerContainer[]);
    },
    (error) => {
      console.error("Error fetching containers data:", error);
      containers$.error(error);
    },
  );

  return new Observable<IDockerContainer[]>((subscriber) => {
    const subscription = containers$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

/**
 * Fetches a single docker container
 * @param containerId
 * @returns Observable<IDockerContainer>
 */
export const dockerContainer = (containerId: string) => {
  const container$ = new BehaviorSubject({} as IDockerContainer);
  const collectionRef = collection(firestore, "containers");

  const unsubscribe = onSnapshot(
    query(collectionRef, where("machine.id", "==", containerId)),
    (doc) => {
      const results = doc.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (results.length > 0) {
        container$.next(results[0] as IDockerContainer);
      }
    },
    (error) => {
      console.error("Error fetching container data:", error);
      container$.error(error);
    },
  );

  return new Observable<IDockerContainer>((subscriber) => {
    const subscription = container$.subscribe(subscriber);

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

export const dockerInfo = () => {
  const info$ = new BehaviorSubject({} as IDockerConfig);
  const docCollection = collection(firestore, "docker");

  const unsubscribe = onSnapshot(
    query(docCollection, where("type", "==", "info")),
    (snapshot) => {
      const infoData = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data) return {};
        return {
          type: data.type,
          ...JSON.parse(data.info),
        };
      });
      info$.next(infoData[0] as IDockerConfig);
    },
    (error) => {
      console.error("Error fetching info data:", error);
      info$.error(error);
    },
  );

  return new Observable<IDockerConfig>((subscriber) => {
    const subscription = info$.subscribe(subscriber);

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
    query(collectionRef, orderBy("updatedAt", "asc")),
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
