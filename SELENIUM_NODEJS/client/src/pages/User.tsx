import React from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const User: React.FC = () => {
  const { user } = useFirebase()

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">User information</h5>
        <p>
          <strong>
            {user?.email}
          </strong>
        </p>
        <div className="alert alert-info" role="alert">
          This is a demo project. All the data is stored in a public database.
        </div>
        {
          !user?.emailVerified ?
          <div className="alert alert-warning" role="alert">
            Email is not verified. Please verify your email address.
          </div> : null
        }
        <div className="mt-4">
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account?")) {
                user?.delete()
              }
            }}
          >
            Delete profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default User
