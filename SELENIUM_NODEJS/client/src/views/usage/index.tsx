import { useEffect, useState } from "react";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { collection, doc, onSnapshot } from "firebase/firestore";
declare var Chart: any;

function UsageView() {
  const [userInformation, setUserInformation] = useState({} as any);
  const [usage, setUsage] = useState([] as any[]);
  const { firestore, user } = useFirebase();

  useEffect(() => {
    const ctx = document.getElementById('usageChart');

    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    const usageData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));

    console.log('usageData', usageData);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates.map((date) => date.toLocaleDateString()),
        datasets: [{
          label: '',
          data: usageData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);
  useEffect(() => {
    if (!firestore || !user) return;
    console.log('user', user);
    const userDoc = doc(firestore, `users/${user.uid}`);
    console.log(`users/${user.uid}`)

    const unsubscribe = onSnapshot(userDoc, (doc) => {
      console.log('doc', doc.data());
      setUserInformation(doc.data());
    });

    return () => {
      unsubscribe();
    };

  }, [firestore, user]);

  useEffect(() => {
    if (!firestore || !user) return;
    const userUsage = collection(firestore, `users/${user.uid}/usage`);

    const unsubscribe = onSnapshot(userUsage, (snapshot) => {
      const usageData = snapshot.docs.map((doc) => doc.data());
      setUsage(usageData);
    });

    return () => {
      unsubscribe();
    };

  }, [firestore, user]);

  return (
    <div>
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5>Usage for this month</h5>
              <canvas id="usageChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="display-6">
            Coin balance
            <span className="badge bg-success rounded-pill ms-2">
              {userInformation?.coinBalance || 0}
              <i className="bi bi-coin ms-2"></i>
            </span>
          </h3>
          <h5 className="card-title">Usage</h5>
          <p className="card-text">This is the usage page.</p>
        </div>
      </div>
      {
        usage.map((item, index) => (
          <div key={index} className="card mt-4 border-warning">
            <div className="card-body">
              <h5 className="card-title">
                {item.title}
              </h5>
              <p className="card-text">Usage: {item.spentCoins} coins</p>
              <span>
                {item.createdAt?.toDate().toLocaleString()}
              </span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default UsageView;