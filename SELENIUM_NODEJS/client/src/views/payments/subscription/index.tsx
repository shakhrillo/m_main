import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../app/hooks"
import "../../../style/subscription.scss"
import { useFirebase } from "../../../contexts/FirebaseProvider"
import { collection, onSnapshot } from "firebase/firestore"

function PaymentsSubscriptionView() {
  const [history, setHistory] = useState([] as any[])
  const [amount, setAmount] = useState(0)
  const dispatch = useAppDispatch()
  const { firestore, user } = useFirebase()

  useEffect(() => {
    if (!user || !firestore) return
    const collectionRef = collection(firestore, `users/${user.uid}/payments`)

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data())
      setHistory(data)
    });

    return unsubscribe
  }, [firestore, user])

  async function buyCoins() {
    const token = await user?.getIdToken()
    const response = await fetch("http://34.122.24.195/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    })

    const data = await response.json()
    const url = data.url
    window.open(url, "_blank")
  }

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <input type="text" placeholder="Amount" onChange={(e) => setAmount(parseInt(e.target.value))} />
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
