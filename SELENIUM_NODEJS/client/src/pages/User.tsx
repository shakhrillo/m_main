import React, { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const User: React.FC = () => {
  const { user } = useFirebase()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    if (!user) return

    if (user.displayName) {
      const [first, last] = user.displayName.split(" ")
      setFirstName(first)
      setLastName(last)
    }

    setEmail(user.email || "")
  }, [])

  return (
    <div>
      <h2>User</h2>
      <div className="user card">
        <h3>Account</h3>
        <p>Real-time information and activities of your property</p>

        <form>
          <div className="d-flex gap-2">
            <div>
              <label htmlFor="firstName">First name</label>
              <input
                name="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={!canEdit}
                placeholder="First name"
                type="text"
                id="firstName"
              />
            </div>
            <div>
              <label htmlFor="lastName">Last name</label>
              <input
                name="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                disabled={!canEdit}
                type="text"
                id="lastName"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              disabled={true}
              type="text"
              id="email"
            />
          </div>
          <div className="d-flex gap-2">
            <div>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                name="currentPassword"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Email"
                disabled={!canEdit}
                type="password"
                id="currentPassword"
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password"
                disabled={!canEdit}
                type="password"
                id="newPassword"
              />
            </div>
          </div>
          <button disabled={!canEdit}>Save</button>
        </form>
      </div>
    </div>
  )
}

export default User
