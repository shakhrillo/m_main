import React, { useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { useMenu } from "../context/MenuContext/MenuContext"
import menuIcon from "../assets/icons/list.svg"

const Settings: React.FC = () => {
  const { user } = useFirebase()

  const [language, setLanguage] = useState("en")

  const { toggleMenu } = useMenu()

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
          <form action="">
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
