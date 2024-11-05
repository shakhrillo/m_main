import React from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const Help: React.FC = () => {
  const { user } = useFirebase()

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Help</h3>
        <h5>FAQ</h5>
        <p>How do I get started?</p>
        <p>How do I get help?</p>
        <p>How do I get support?</p>
        <h5>Contact</h5>
        <p>Email: </p>
        <p>Phone: </p>
        <h5>Feedback</h5>
        <p>How can we improve?</p>
        <p>What do you like?</p>
      </div>
    </div>
  )
}

export default Help
