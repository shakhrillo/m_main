import { doc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseProvider"
import "../../style/user.scss"

const UsersView: React.FC = () => {
  const [userInformation, setUserInformation] = useState({} as any)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { user, firestore } = useFirebase()

  useEffect(() => {
    if (!firestore || !user) return
    const userDoc = doc(firestore, `users/${user.uid}`)
    const unsubscribe = onSnapshot(userDoc, doc => {
      setUserInformation(doc.data())
    })

    return () => {
      unsubscribe()
    }
  }, [firestore, user])

  return (
    <div className="profile">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="profile__image">
                {user?.photoURL ? (
                  <img
                    src={user?.photoURL}
                    alt="User profile"
                    className="profile__image-img rounded-circle"
                  />
                ) : (
                  <div className="profile__image-placeholder w-100 h-100 d-flex justify-content-center align-items-center rounded-circle">
                    <i className="bi-person"></i>
                  </div>
                )}
              </div>

              <div className="profile__name d-flex flex-column gap-1">
                <span className="profile__name-first">{user?.email}</span>
                <span className="profile__name-location">
                  {user?.displayName || "No name"}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="profile__balance d-flex">
                <span>Balance: </span>
                <span>{userInformation?.coinBalance || 0} coins</span>
              </div>
              <div className="profile__uid d-flex">
                <span>UID: </span>
                <span>{user?.uid}</span>
              </div>
            </div>
            <div></div>
            {/* <button className="profile__edit-button edit-info border py-2 px-3 d-flex gap-2">
            <span>Edit</span>
            <i className="bi-pencil"></i>
          </button> */}
          </div>
          <form onSubmit={() => {}} className="d-flex flex-column gap-2 mt-3">
            <div className="row">
              <div className="col">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="form-control"
                  id="firstName"
                  placeholder="First name"
                />
              </div>
              <div className="col">
                <label htmlFor="lastname">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="form-control"
                  id="lastname"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  readOnly
                />
              </div>
              <div className="col d-flex align-items-end justify-content-end">
                <button className="btn">
                  <i className="bi-plus-circle"></i> Add another email
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="form-control"
                    id="password"
                    placeholder="Password"
                  />
                  <span
                    className="input-group-text bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </span>
                </div>
              </div>
              <div className="col">
                <label htmlFor="newPassword">New password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="form-control"
                    id="newPassword"
                    placeholder="New password"
                  />
                  <span
                    className="input-group-text bg-transparent"
                    onClick={() => setShowNewPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col d-flex gap-2">
                <button className="btn" type={"submit"}>
                  Save
                </button>
                <button className="btn">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UsersView
