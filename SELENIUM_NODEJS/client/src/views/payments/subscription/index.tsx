import { useState } from "react"
import { useAppDispatch } from "../../../app/hooks"
import "../../../style/subscription.scss"

function PaymentsSubscriptionView() {
  const [amount, setAmount] = useState(0)
  const dispatch = useAppDispatch()

  async function buyCoins() {
    const response = await fetch("http://127.0.0.1:1337/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })

    const data = await response.json()
    const url = data.url
    window.open(url, "_blank")
  }

  return (
    <div className="card">
      <div className="card-body">
        <input type="text" placeholder="Amount" onChange={(e) => setAmount(parseInt(e.target.value))} />
        <button onClick={buyCoins}>Buy Coins</button>
      </div>
    </div>
  )
}

export default PaymentsSubscriptionView
