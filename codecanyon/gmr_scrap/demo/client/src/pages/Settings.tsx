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

  async function saveSettings() {
    if (!firestore) return
    const settingsRef = doc(firestore, `app/settings`)
    await updateDoc(settingsRef, {
      language,
      currency,
      costs,
    })

    alert("Settings saved")
  }

  return (
    <div>
      <h3>Settings</h3>
      <div className="mt-3">
        <div>
          <form
            onSubmit={e => {
              e.preventDefault()
              saveSettings()
            }}
          >
            <div className="row mb-3 justify-content-center align-items-center">
              <div className="col">
                <label htmlFor="currency" className="form-label">
                  Currency
                </label>
                <div className="row">
                  <div
                    className="btn-group w-auto"
                    role="group"
                    aria-label="Default button group"
                  >
                    <button
                      type="button"
                      onClick={() => setCurrency("all")}
                      className={`btn btn-outline-primary ${currency === "usd" && "active"}`}
                    >
                      USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("completed")}
                      className={`btn btn-outline-primary ${currency === "eur" && "active"}`}
                    >
                      EUR
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("pending")}
                      className={`btn btn-outline-primary ${currency === "cad" && "active"}`}
                    >
                      CAD
                    </button>
                  </div>
                </div>
                <span className="form-text">Select your currency</span>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label htmlFor="coin" className="form-label">
                    1 coin costs in {currency}
                  </label>
                  <input
                    type="text"
                    name="coin"
                    id="coin"
                    className="form-control"
                    placeholder="0.01"
                    value={costs}
                    onChange={e => setCosts(e.target.value)}
                  />
                  <a
                    href="https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts"
                    className="form-text"
                  >
                    Learn more about minimum charge
                  </a>
                </div>
              </div>
            </div>
            <div className="mb-3 col-6">
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
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
