import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import menuIcon from "../assets/icons/list.svg"
import { useMenu } from "../context/MenuContext/MenuContext"
import { useFirebase } from "../contexts/FirebaseProvider"
import { buyCoins, getPaymentsQuery } from "../services/firebaseService"

function Payments() {
  const { firestore, user } = useFirebase()

  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([] as any[])
  const [minAmount, setMinAmount] = useState("100")
  const [amount, setAmount] = useState("100")
  const [currency, setCurrency] = useState("usd")
  const [totalPrice, setTotalPrice] = useState("0")
  const [userInformation, setUserInformation] = useState({} as any)
  const [coinId, setCoinId] = useState("")

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
    if (!coinId) return

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user?.uid}/buyCoins`, coinId),
      doc => {
        const data = doc.data()
        const url = data?.url
        if (url) {
          window.open(url, "_blank")
        }
      },
    )

    return () => unsubscribe()
  }, [coinId])

  useEffect(() => {
    if (!firestore) return
    const settingsRef = doc(firestore, `app/settings`)
    const unsubscribe = onSnapshot(settingsRef, doc => {
      if (doc.exists()) {
        const data = doc.data()
        const costs = Number(data.costs)
        const currency = data.currency
        const minimumCount = 99

        const minimumCost = 0.5
        if (["usd", "eur", "cad"].includes(currency)) {
          const amount = Math.max(minimumCount, Math.ceil(minimumCost / costs))
          setAmount(amount.toString())
          setTotalPrice((amount * costs).toFixed(2))
        }
        setCurrency(currency)
        setMinAmount(minimumCount.toString())
      }
    })

    return () => {
      unsubscribe()
    }
  }, [firestore])

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
          <form>
            <div className="form-wrap">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={e => {
                  const value = e.target.value
                  setAmount(value)
                }}
                className="form-select"
                min={minAmount}
              />
              <p>
                Min: {minAmount} coins, Total: {totalPrice} {currency}
              </p>
            </div>
            <button
              onClick={async () => {
                setIsLoading(true)
                const coindId =
                  (await buyCoins(user!.uid, Number(amount) * 100)) || ""
                setCoinId(coindId)
                setIsLoading(false)
              }}
              disabled={isLoading}
              className="button"
            >
              Buy {amount} coins ({totalPrice} {currency})
            </button>
          </form>
          <hr />
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
