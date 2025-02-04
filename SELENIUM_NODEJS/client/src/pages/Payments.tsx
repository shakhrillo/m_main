import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  buyCoins,
  getBuyCoinsQuery,
  getPaymentsQuery,
} from "../services/firebaseService"
import { useMenu } from "../context/MenuContext/MenuContext"
import menuIcon from "../assets/icons/list.svg"

function Payments() {
  const { firestore, user } = useFirebase()

  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([] as any[])
  const [amount, setAmount] = useState(0)
  const [userInformation, setUserInformation] = useState({} as any)

  useEffect(() => {
    if (!user || !firestore) return

    const unsubscribe = onSnapshot(getPaymentsQuery(user.uid), snapshot => {
      const historyData = snapshot.docs.map(doc => doc.data())
      setHistory(historyData)
    })

    return () => unsubscribe()
  }, [firestore, user])

  useEffect(() => {
    if (!firestore || !user) return
    const userDoc = doc(firestore, `users/${user.uid}`)

    const unsubscribe = onSnapshot(userDoc, doc => {
      setUserInformation(doc.data())
    })

    return () => {
      unsubscribe()
    }
  }, [firestore, user])

  useEffect(() => {
    if (!user || !firestore) return

    let initial = true

    const unsubscribe = onSnapshot(getBuyCoinsQuery(user.uid), snapshot => {
      if (initial) {
        initial = false
        return
      }

      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          const { url } = change.doc.data()
          window.open(url, "_self")
        }
      })
    })

    return () => unsubscribe()
  }, [firestore, user])

  const { toggleMenu } = useMenu()

  return (
    <div>
      <div className="d-flex align-items-center gap-3 py-3 my-5">
        <button className="sidebar-toggle-btn button" onClick={toggleMenu}>
          <img src={menuIcon} alt="menu-icon" />
        </button>
        <h3 className="m-0">Payments</h3>
        <button className="button button-lg button-success ml-auto">
          {(userInformation?.coinBalance || 0)
            .toFixed()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
          coins
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <button
            onClick={async () => {
              setIsLoading(true)
              await buyCoins(user!.uid, 100)
              setIsLoading(false)
            }}
            disabled={isLoading}
            className="button"
          >
            Buy 100 coins
          </button>
          <br />
          <table className="table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.amount / 100} usd</td>
                  <td>
                    <span>
                      {item.status === "succeeded" ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td>{item.created?.toDate().toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
