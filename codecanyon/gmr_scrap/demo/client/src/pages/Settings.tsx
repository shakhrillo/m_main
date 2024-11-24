import React, { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { useMenu } from "../context/MenuContext/MenuContext"
import menuIcon from "../assets/icons/list.svg"
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const Settings: React.FC = () => {
  const { user, firestore } = useFirebase()

  const [currency, setCurrency] = useState("usd")
  const [costs, setCosts] = useState("0.01")
  const [language, setLanguage] = useState("en")

  const { toggleMenu } = useMenu()

  useEffect(() => {
    if (!firestore) return
    const settingsRef = doc(firestore, `app/settings`)
    const unsubscribe = onSnapshot(settingsRef, doc => {
      if (doc.exists()) {
        const data = doc.data()
        setCurrency(data.currency)
        setCosts(data.costs)
        setLanguage(data.language)
      } else {
        setDoc(
          settingsRef,
          {
            language: "en",
            currency: "usd",
            costs: "0.01",
          },
          { merge: true },
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [firestore])

  function saveSettings() {
    if (!firestore) return
    const settingsRef = doc(firestore, `app/settings`)
    updateDoc(settingsRef, {
      language,
      currency,
      costs,
    })
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <button className="sidebar-toggle-btn button" onClick={toggleMenu}>
          <img src={menuIcon} alt="menu-icon" />
        </button>
        <h2>Settings</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <form
            onSubmit={e => {
              e.preventDefault()
              saveSettings()
            }}
          >
            <div className="form-wrap">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                name="currency"
                id="currency"
                className="form-select"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="cad">CAD</option>
              </select>
            </div>
            <div className="form-wrap">
              <label htmlFor="coin" className="form-label">
                1 coin costs in {currency}
              </label>
              <input
                type="string"
                name="coin"
                id="coin"
                className="form-input"
                placeholder="0.01"
                value={costs}
                onChange={e => setCosts(e.target.value)}
              />
              <a href="https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts">
                Learn more about minimum charge
              </a>
            </div>
            <div className="form-wrap">
              <label htmlFor="language" className="form-label">
                Language
              </label>
              <select
                name="language"
                id="language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="form-select"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>
            <button className="button button-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
