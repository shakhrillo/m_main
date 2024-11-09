import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  buyCoins,
  getBuyCoinsQuery,
  getPaymentsQuery,
} from "../services/firebaseService"

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

  return (
    <div className="payments">
      <div className="payments__wrapper">
        <div className="payments__header">
          <div className="payments__header__title">
            <div className="payments__header__title__icon">
              <i className="bi bi-coin"></i>
            </div>
            <span className="payments__header__title__text">Buy coins</span>
          </div>
          <div className="payments__header__balance">
            <span>Balance:</span>
            <b>345</b>
          </div>
        </div>
        <div className="payments__body">
          <div className="payments__body__wrapper">
            <span className="payments__body__currency">
              <i className="bi bi-currency-dollar"></i>
            </span>
            <input
              className="form-control geo-input"
              value={0.0}
              type={"number"}
            />
            <button className="btn geo-btn-primary">Buy</button>
            <span className="payments__body__info">
              <i className="bi bi-info-circle-fill"></i>1 coins is equal to 0.01
              USD
            </span>
          </div>
          <div className="payments__body__card-info">
            For test you can use the following card number:{" "}
            <code>4242 4242 4242 4242</code> with any CVC and a valid expiration
            date. For failed payments you can use the following card number:{" "}
            <code>4000 0027 6000 3184</code> with any CVC and a valid expiration
            date.
          </div>
        </div>
        <div className="payments__history">
          <div className="payments__history__title">
            <div className="payments__history__title__icon">
              <i className="bi bi-bank"></i>
            </div>
            <span className="payments__history__title__text">
              Your transactions
            </span>
          </div>
          <div className="payments__history__table__wrapper">
            <table className={"payments__history__table table table-bordered"}>
              <thead>
                <th className="payments__history__header">#</th>
                <th className="payments__history__header">Price</th>
                <th className="payments__history__header">Status</th>
                <th className="payments__history__header">Date</th>
              </thead>
              <tbody>
                <tr className="payments__history__body__row">
                  <th className="payments__history__body">1</th>
                  <td className="payments__history__body">
                    <b>20 USD</b>
                  </td>
                  <td className="payments__history__body">
                    <div className="payments__history__body__wrapper">
                      <span className="geo-badge geo-badge--completed">
                        <b>Success</b>
                      </span>
                      {/* <span className="geo-badge geo-badge--in-progress">
                        <b>In progress</b>
                      </span>
                      <span className="geo-badge geo-badge--failed">
                        <b>Canceled</b>
                      </span> */}
                    </div>
                  </td>
                  <td className="payments__history__body">
                    4 November 2024 - 1:55:10 AM
                  </td>
                </tr>
                <tr className="payments__history__body__row">
                  <th className="payments__history__body">1</th>
                  <td className="payments__history__body">
                    <b>20 USD</b>
                  </td>
                  <td className="payments__history__body">
                    <div className="payments__history__body__wrapper">
                      <span className="geo-badge geo-badge--completed">
                        <b>Success</b>
                      </span>
                    </div>
                  </td>
                  <td className="payments__history__body">
                    4 November 2024 - 1:55:10 AM
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className="card">
        <div className="card-body">
          <h2 className="card-title">Buy Coins</h2>
          <p>
            Current Balance:{" "}
            <span className="badge bg-success">
              {(userInformation?.coinBalance || 0)
                .toFixed()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              coins
            </span>
          </p>
          <div className="row">
            <div className="col col-md-6 col-lg-6">
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  onChange={e => {
                    const value = parseFloat(e.target.value)
                    if (isNaN(value)) return
                    if (value > 1000) {
                      e.target.value = "1000"
                      setAmount(100000)
                      return
                    }
                    setAmount(parseFloat(e.target.value) * 100)
                  }}
                  placeholder="0.00"
                />
                <button
                  className="btn btn-primary px-5"
                  onClick={async () => {
                    setIsLoading(true)
                    await buyCoins(user!.uid, amount)
                    setAmount(0)
                  }}
                  disabled={isLoading}
                >
                  Buy
                </button>
              </div>
              <p>1 coin is equal to 0.01 usd.</p>
            </div>
          </div>
          <div className="alert alert-info">
            For test you can use the following card number:{" "}
            <code>4242 4242 4242 4242</code> with any CVC and a valid expiration
            date. For failed payments you can use the following card number:{" "}
            <code>4000 0027 6000 3184</code> with any CVC and a valid expiration
            date.
          </div>
          <h5 className="mt-3">Payment History</h5>
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
              {history.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.amount / 100} usd</td>
                  <td>
                    <span
                      className={`badge ${item.status === "succeeded" ? "bg-success" : "bg-danger"}`}
                    >
                      {item.status === "succeeded" ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td>{item.created?.toDate().toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  )
}

export default Payments
