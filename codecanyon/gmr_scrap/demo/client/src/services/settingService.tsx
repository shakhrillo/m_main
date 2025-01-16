import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";

const startDate: Date = new Date();
startDate.setMonth(startDate.getMonth() - 12);

export const getSettings = () => {
  const collectionRef = collection(firestore, "settings");
  const settings$ = new BehaviorSubject({} as any);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const settings = {} as any;
    snapshot.docs.map((doc) => {
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

export const allUsers = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "users");
  const users$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("createdAt", ">", fromDate)),
    (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      users$.next(usersData);
    },
  );

  return new Observable<any>((subscriber) => {
    const subscription = users$.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
      unsubscribe();
    };
  });
};

export const allContainers = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "containers");
  const containers$ = new BehaviorSubject([] as any);

  const unsubscribe = onSnapshot(
    query(
      collectionRef,
      // where("createdAt", ">", fromDate),
      where("type", "==", "comments"),
      // where("status", "==", "completed"),
    ),
    (snapshot) => {
      const containersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      containers$.next(containersData);
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
    snapshot.docs.map((doc) => {
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
