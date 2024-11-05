import React from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Settings: React.FC = () => {
  const { user } = useFirebase()

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Settings</h3>
        <h5>Preferences</h5>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" />
          <label className="form-check-label">
            Receive alerts to email once extraction is complete
          </label>
        </div>
        <button className="btn btn-primary mt-3">Save</button>
      </div>
    </div>
  )
}

export default Settings
