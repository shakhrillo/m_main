import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
  startAt,
  endAt,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import * as geofire from "geofire-common";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

const startDate: Date = new Date();
startDate.setMonth(startDate.getMonth() - 12);

export const getSettings = () => {
  const collectionRef = collection(firestore, "settings");
  const settings$ = new BehaviorSubject({} as any);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const settings = {} as any;
    snapshot.docs.forEach((doc) => {
      const data = doc.data() || {};
      settings[doc.id] = data;
    });
    settings$.next(settings);
  });

  return new Observable<any>((subscriber) => {
    const subscription = settings$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

/**
 * Get setting value by tag and type.
 * @param tag string
 * @param type string
 * @returns Observable<any>
 */
export const settingValue = ({ tag, type }: { tag: string; type: string }) => {
  const collectionRef = collection(firestore, "settings");
  const settings$ = new BehaviorSubject<any>(null);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("type", "==", type), where("tag", "==", tag)),
    (snapshot) => {
      const settingData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      settings$.next(settingData[0]);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = settings$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const updateSettingValue = (id: string, data: any) => {
  const docRef = doc(firestore, "settings", id);
  return updateDoc(docRef, data);
};

export const updateCoinSettings = (id: string, data: any) => {
  const docRef = doc(firestore, "settings", id);
  return updateDoc(docRef, data);
};

/**
 * Get all users from firestore.
 * @param fromDate Date
 * @returns Observable<IUserInfo[]>
 */
export const usersList = (lastRef?: DocumentData | null) => {
  const users$ = new BehaviorSubject<QuerySnapshot<DocumentData>>(null as any);
  const collectionRef = collection(firestore, "users");

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      orderBy("createdAt", "desc"),
      limit(10),
      ...(lastRef ? [startAfter(lastRef)] : []),
    ),
    (snapshot) => users$.next(snapshot),
    (error) => {
      console.error("Error fetching containers data:", error);
      users$.error(error);
    },
  );

  return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    const subscription = users$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const allContainersByGeoBounds = async (
  bounds: google.maps.LatLngBounds,
) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const center: [number, number] = [
    (sw.lat() + ne.lat()) / 2,
    (sw.lng() + ne.lng()) / 2,
  ];
  const radiusInM =
    geofire.distanceBetween([sw.lat(), sw.lng()], [ne.lat(), ne.lng()]) * 1000;

  const boundsQueries = geofire.geohashQueryBounds(center, radiusInM);
  const promises = boundsQueries.map(([start, end]) =>
    getDocs(
      query(
        collection(firestore, "containers"),
        orderBy("geohash"),
        startAt(start),
        endAt(end),
      ),
    ),
  );

  const snapshots = await Promise.all(promises);
  const matchingDocs: any[] = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const data = doc.data();
      const { latitude, longitude } = data.location;

      // Extra filtering for false positives
      const distance =
        geofire.distanceBetween([latitude, longitude], center) * 1000;
      if (distance <= radiusInM) {
        matchingDocs.push({ id: doc.id, ...data });
      }
    }
  }

  return matchingDocs;
};

export const totalEarnings = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "earnings");
  const earnings$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("createdAt", ">", fromDate)),
    (snapshot) => {
      const earningsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      earnings$.next(earningsData);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = earnings$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const appStatistics = () => {
  const collectionRef = collection(firestore, "statistics");
  const statistics$ = new BehaviorSubject({} as any);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const statistics = {} as any;
    snapshot.docs.forEach((doc) => {
      const data = doc.data() || {};
      statistics[doc.id] = data["total"] || 0;
    });
    statistics$.next(statistics);
  });

  return new Observable<any>((subscriber) => {
    const subscription = statistics$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};
