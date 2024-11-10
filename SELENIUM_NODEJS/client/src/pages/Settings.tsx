import React, { useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Settings: React.FC = () => {
  const { user } = useFirebase()

  const [language, setLanguage] = useState("en")
  const [notIsCompleted, setNotIsComplated] = useState(false)
  const [notOnLogin, setNotOnLogin] = useState(false)

  return (
    <div>
      <h2>Settings</h2>
      <div className="card">
        <h3>Account</h3>
        <p>Real-time information and activities of your property</p>

        <form action="" className="d-flex flex-column gap-2">
          <div>
            <label htmlFor="language">Language</label>
            <select
              name="language"
              id="language"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <div className="d-flex gap-1">
              <input
                name="notIsCompleted"
                type="checkbox"
                checked={notIsCompleted}
                onChange={() => setNotIsComplated(!notIsCompleted)}
              />
              <label htmlFor="notIsCompleted">
                Notify when scraping is completed
              </label>
            </div>
            <div className="d-flex gap-1">
              <input
                name="notOnLogin"
                type="checkbox"
                checked={notOnLogin}
                onChange={() => setNotOnLogin(!notOnLogin)}
              />
              <label htmlFor="notOnLogin">Notify on login</label>
            </div>
          </div>
          <button className="primary">Save</button>
        </form>
      </div>
    </div>
  )
}

export default Settings
