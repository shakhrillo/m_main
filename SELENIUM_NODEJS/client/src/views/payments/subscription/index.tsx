import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../../../contexts/FirebaseProvider"
import "../../../style/subscription.scss"

function PaymentsSubscriptionView() {
  const [history, setHistory] = useState([] as any[])
  const [amount, setAmount] = useState(0)
  const { firestore, user } = useFirebase()

  useEffect(() => {
    if (!user || !firestore) return
    const collectionRef = collection(firestore, `users/${user.uid}/payments`)
    const historyQuery = query(collectionRef, orderBy("created", "desc"))

    const unsubscribe = onSnapshot(historyQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data())
      setHistory(data)
    });

    return unsubscribe
  }, [firestore, user])

  useEffect(() => {
    if (!user || !firestore) return
    const collectionRef = collection(firestore, `users/${user.uid}/buy`)
    let initial = true

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (initial) {
        initial = false
        return
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const { url } = change.doc.data()
          window.open(url, "_self")
        }
      })
    })

    return unsubscribe
    

  }, [firestore, user])

  async function buyCoins() {
    if (!user || !firestore) return
    const collectionRef = collection(firestore, `users/${user?.uid}/buyCoins`)
    await addDoc(collectionRef, {
      amount
    });
    setAmount(0)
  }

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <input type="text" placeholder="Amount" onChange={(e) => setAmount(parseInt(e.target.value))} min="100" />
          <button onClick={buyCoins}>Buy Coins</button>
        </div>
      </div>
      <hr />
      {
        history.map((item, index) => (
          <div key={index} className="card mb-2">
            <div className="card-body">
              <p className="d-flex justify-content-between">
                {item.amount / 100 } usd 
                <span className={ item.status === 'succeeded' ? 'text-success' : 'text-danger'}>
                  {item.status}
                </span>
              </p>
              <small>{item.created?.toDate().toLocaleString()}</small>
            </div>
          </div>
        ))
      }
      {/* <ul>
        {history.map((item, index) => (
          <li key={index}>
            <div>{item.amount}</div>
            <div>{item.date}</div>
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default PaymentsSubscriptionView
