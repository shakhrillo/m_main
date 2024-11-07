import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { buyCoins, getBuyCoinsQuery, getPaymentsQuery } from "../services/firebaseService"

function Payments() {
  const { firestore, user } = useFirebase()
  
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([] as any[])
  const [amount, setAmount] = useState(0);
  const [userInformation, setUserInformation] = useState({} as any);

  useEffect(() => {
    if (!user || !firestore) return;
  
    const unsubscribe = onSnapshot(getPaymentsQuery(user.uid), (snapshot) => {
      const historyData = snapshot.docs.map((doc) => doc.data());
      setHistory(historyData);
    });
  
    return () => unsubscribe();
  }, [firestore, user]);
  
  useEffect(() => {
    if (!firestore || !user) return;
    const userDoc = doc(firestore, `users/${user.uid}`);

    const unsubscribe = onSnapshot(userDoc, (doc) => {
      setUserInformation(doc.data());
    });

    return () => {
      unsubscribe();
    };

  }, [firestore, user]);

  useEffect(() => {
    if (!user || !firestore) return;
  
    let initial = true;
  
    const unsubscribe = onSnapshot(getBuyCoinsQuery(user.uid), (snapshot) => {
      if (initial) {
        initial = false;
        return;
      }
  
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const { url } = change.doc.data();
          window.open(url, "_self");
        }
      });
    });
  
    return () => unsubscribe();
  }, [firestore, user]);  

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Buy Coins</h2>
          <p>Current Balance: <span className="badge bg-success">
            {(userInformation?.coinBalance || 0).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} coins
          </span></p>
          <div className="row">
            <div className="col col-md-6 col-lg-6">
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="number" 
                  className="form-control" 
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) return;
                    if (value > 1000) {
                      e.target.value = "1000";
                      setAmount(100000);
                      return;
                    }
                    setAmount(parseFloat(e.target.value) * 100)
                  }}
                  placeholder="0.00"
                />
                <button className="btn btn-primary px-5" onClick={async () => {
                  setIsLoading(true)
                  await buyCoins(user!.uid, amount)
                  setAmount(0)
                }} disabled={isLoading}>
                  Buy
                </button>
              </div>
              <p>
                1 coin is equal to 0.01 usd.
              </p>
            </div>
          </div>
          <div className="alert alert-info">
            For test you can use the following card number: <code>4242 4242 4242 4242</code> with any CVC and a valid expiration date.
            For failed payments you can use the following card number: <code>4000 0027 6000 3184</code> with any CVC and a valid expiration date.
          </div>
          <h5 className="mt-3">
            Payment History
          </h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {
                history.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.amount / 100} usd</td>
                    <td>
                      <span className={`badge ${item.status === "succeeded" ? "bg-success" : "bg-danger"}`}>
                        {item.status === "succeeded" ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td>{item.created?.toDate().toLocaleString()}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}

export default Payments
