import React, { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { useMenu } from "../context/MenuContext/MenuContext"

const User: React.FC = () => {
  const { user } = useFirebase()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!user) return

    if (user.displayName) {
      const [first, last] = user.displayName.split(" ")
      setFirstName(first)
      setLastName(last)
    }

    setEmail(user.email || "")
  }, [])

  const { toggleMenu } = useMenu()

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <button className="sidebar-toggle-btn" onClick={toggleMenu}>
          m
        </button>
        <h2>Account</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-wrap">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={true}
                placeholder="Email"
                type="text"
                id="email"
                className="form-input"
              />
            </div>
            <div className="form-wrap">
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <input
                name="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
                type="text"
                id="firstName"
                className="form-input"
              />
            </div>
            <div className="form-wrap">
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <input
                name="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                type="text"
                id="lastName"
                className="form-input"
              />
            </div>
            <div className="form-wrap">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                id="password"
                className="form-input"
              />
            </div>
            <button className="button button-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default User
