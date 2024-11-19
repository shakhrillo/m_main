import React from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { useMenu } from "../context/MenuContext/MenuContext"

const Help: React.FC = () => {
  const { user } = useFirebase()
  const { toggleMenu } = useMenu()
  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <button className="sidebar-toggle-btn" onClick={toggleMenu}>
          m
        </button>
        <h2>Help</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <h4>How to scrape reviews?</h4>
          <p>
            To scrape reviews, go to the Scrap page and enter the URL of the
            place you want to scrape reviews from.
          </p>
          <h4>How to download reviews?</h4>
          <p>
            To download reviews, go to the Scrap page and click the download
            button.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Help
