import { useEffect } from "react";
import { useFirebase } from "../contexts/FirebaseProvider";

const Dashboard: React.FC = () => {
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) return;

    // return () => unsubscribe()
  }, [firestore]);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <h1>Earnings</h1>
              <p>Coming soon...</p>
            </div>
            <div className="col">
              <h1>New Users</h1>
              <p>Coming soon...</p>
            </div>
            <div className="col">
              <h1>Map Scrap Pins</h1>
              <p>Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
