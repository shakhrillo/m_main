import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { BehaviorSubject, Observable } from "rxjs";
import { IUserInfo } from "../types/userInfo";

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
export const allUsers = (fromDate = startDate) => {
  const collectionRef = collection(firestore, "users");
  const users$ = new BehaviorSubject([] as IUserInfo[]);

  const unsubscribe = onSnapshot(
    query(collectionRef, where("createdAt", ">", fromDate)),
    (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as IUserInfo,
      }));
      users$.next(usersData);
    },
  );

  return new Observable<IUserInfo[]>((subscriber) => {
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
