import React, { useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Settings: React.FC = () => {
  const { user } = useFirebase()

  const [language, setLanguage] = useState("en")
  const [notIsCompleted, setNotIsComplated] = useState(false)
  const [notOnLogin, setNotOnLogin] = useState(false)

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <div className="settings__header">
          <div className="settings__header__title">
            <div className="settings__header__title__icon">
              <i className="bi bi-gear"></i>
            </div>
            <span className="settings__header__title__text">Settings</span>
          </div>
        </div>
        <div className="settings__body">
          <h6 className="settings__body__title">
            <i className="bi bi-translate"></i> Language
          </h6>
          <div className="settings__body__wrapper">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="form-select geo-input"
              name="language-select"
              id="languageSelect"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="ge">German</option>
            </select>
          </div>
        </div>
        <div className="settings__body">
          <h6 className="settings__body__title">
            <i className="bi bi-bell-fill"></i> Notifications
          </h6>
          <div className="settings__body__wrapper">
            <input
              className="form-check-input geo-checkbox"
              checked={notIsCompleted}
              onChange={() => setNotIsComplated(prev => !prev)}
              type={"checkbox"}
              id={"emailNotificationCheck"}
            />
            <label
              className="settings__body__title"
              htmlFor="emailNotificationCheck"
            >
              Recive alerts to email once extraction is completed
            </label>
          </div>
          <div className="settings__body__wrapper">
            <input
              className="form-check-input geo-checkbox"
              checked={notOnLogin}
              onChange={() => setNotOnLogin(prev => !prev)}
              type={"checkbox"}
              id={"emailNotificationCheck"}
            />
            <label
              className="settings__body__title"
              htmlFor="emailNotificationCheck"
            >
              Once you login GeoScraper, we will send you a notification in emal
            </label>
          </div>
        </div>
      </div>
      <div className="settings__save">
        <button className="btn geo-btn-primary">Save</button>
      </div>
    </div>
  )
}

export default Settings
