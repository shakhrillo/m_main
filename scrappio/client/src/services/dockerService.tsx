import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { firestore } from "../firebaseConfig";
import type { IDockerQuery } from "../types/dockerQuery";
import type { IDockerStats } from "../types/dockerStats";

/**
 * Create a new docker container
 * @param data
 */
export const createDockerContainer = (data: any) => {
  console.log("Creating docker container with data:", data);
  return new Promise<any>((resolve, reject) => {
    addDoc(collection(firestore, "containers"), data)
      .then((docRef) => {
        resolve({
          id: docRef.id,
          ...data,
        });
      })
      .catch((error) => reject(error));
  });
};

/**
 * Fetches all docker containers
 * @returns Observable<IDockerContainer[]>
 */
export const dockerContainers = (q: IDockerQuery = {}, lastRef?: any) => {
  const containers$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(
    null as any,
  );
  const collectionRef = collection(firestore, "containers");

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(10),
      ...(lastRef ? [startAfter(lastRef)] : []),
      ...(q.uid ? [where("uid", "==", q.uid)] : []),
      ...(q.type ? [where("type", "==", q.type)] : []),
      ...(q.machineType ? [where("machine.Type", "==", q.machineType)] : []),
      ...(q.machineId ? [where("machineId", "==", q.machineId)] : []),
      ...(q.search ? [where("keywords", "array-contains", q.search)] : []),
      ...(q.status ? [where("status", "==", q.status)] : []),
      ...(q.containerId ? [where("containerId", "==", q.containerId)] : []),
    ),
    (snapshot) => containers$.next(snapshot),
    (error) => {
      console.error("Error fetching containers data:", error);
      containers$.error(error);
    },
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
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
 * @returns Observable<any>
 */
export const dockerImages = (lastRef?: any) => {
  const images$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(null as any);
  const collectionRef = collection(firestore, "machines");

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      limit(10),
      where("Type", "==", "image"),
      ...(lastRef ? [startAfter(lastRef)] : []),
    ),
    (snapshot) => images$.next(snapshot),
    (error) => {
      console.error("Error fetching images data:", error);
      images$.error(error);
    },
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    const subscription = images$.subscribe(subscriber);

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
export const dockerImage = (imageId: string) => {
  const image$ = new BehaviorSubject({} as any);
  const docRef = doc(firestore, "machines", imageId);

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      const imageData = {
        id: doc.id,
        ...doc.data(),
      };
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

/**
 * Fetches a single docker container
 * @param containerId
 * @returns Observable<IDockerContainer>
 */
export const dockerContainerLogs = (containerId: string) => {
  const logs$ = new BehaviorSubject([] as any);
  const collectionRef = collection(firestore, "machines", containerId, "logs");

  const unsubscribe = onSnapshot(
    query(collectionRef, orderBy("updatedAt", "asc")),
    (snapshot) => {
      const logsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      logs$.next(logsData);
    },
    (error) => {
      console.error("Error fetching logs data:", error);
      logs$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = logs$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

/**
 * Fetches a single docker container
 * @param containerId
 * @returns Observable<any>
 */
export const dockerContainerBrowserLogs = (containerId: string) => {
  const logs$ = new BehaviorSubject(null as any);
  const collectionRef = collection(
    firestore,
    "machines",
    containerId,
    "browserLogs",
  );

  const unsubscribe = onSnapshot(
    query(collectionRef),
    (snapshot) => logs$.next(snapshot),
    (error) => logs$.error(error)
  );

  return new Observable<any>((subscriber) => {
    const subscription = logs$.subscribe(subscriber);

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
export const dockerContainerHistory = (containerId: string) => {
  const history$ = new BehaviorSubject([] as any);
  const collectionRef = collection(
    firestore,
    "machines",
    containerId,
    "history",
  );

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      history$.next(historyData);
    },
    (error) => {
      console.error("Error fetching history data:", error);
      history$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = history$.subscribe(subscriber);

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
export const dockerContainerScreenshots = (containerId: string) => {
  const screenshots$ = new BehaviorSubject([] as any);
  const collectionRef = collection(
    firestore,
    "machines",
    containerId,
    "screenshots",
  );

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const screenshotsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      screenshots$.next(screenshotsData);
    },
    (error) => {
      console.error("Error fetching screenshots data:", error);
      screenshots$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = screenshots$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

/**
 * Update an existing docker container
 * @param containerId
 * @param data
 */
export const updateDockerContainer = async (containerId: string, data: any) => {
  const containerRef = doc(firestore, "containers", containerId);
  return await updateDoc(containerRef, data);
};

/**
 * Fetches docker container stats
 * @param containerId
 * @returns Observable<IDockerStats[]>
 */
export const dockerContainerStats = (containerId: string) => {
  const stats$ = new BehaviorSubject([] as IDockerStats[]);
  const collectionRef = collection(firestore, "machines", containerId, "stats");

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const statsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IDockerStats[];
      stats$.next(statsData);
    },
    (error) => {
      console.error("Error fetching stats data:", error);
      stats$.error(error);
    },
  );

  return new Observable<IDockerStats[]>((subscriber) => {
    const subscription = stats$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};


export const dockerContainerPlaces = (containerId: string) => {
  const places$ = new BehaviorSubject([] as any);
  const collectionRef = collection(
    firestore,
    "containers",
    containerId,
    "places",
  );

  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const placesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      places$.next(placesData);
    },
    (error) => {
      console.error("Error fetching places data:", error);
      places$.error(error);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = places$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
}