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
    <div className="user">
      <div className="user__wrapper">
        <div className="user__header">
          <div className="user__header-text">
            <h5 className="user__header-title">Account</h5>
            <span className="user__header-subtitle">
              Real-time information and activities of your property
            </span>
          </div>
          <div className="user__header-btns">
            <button
              onClick={() => setCanEdit(prev => !prev)}
              className="btn geo-btn-transparent geo-btn-outline"
            >
              {canEdit ? (
                <>
                  <i className="bi bi-x-lg"></i>
                  Cancel
                </>
              ) : (
                <>
                  <i className="bi bi-pencil"></i>
                  Edit
                </>
              )}
            </button>
            <button className="btn geo-btn-transparent geo-btn-outline">
              <i className="bi bi-box-arrow-left"></i>
              Log out
            </button>
            <button className="btn geo-btn-danger-outline">
              <i className="bi bi-trash"></i>
              Delete my account
            </button>
          </div>
        </div>
        <div className="user__body">
          <div className="user__body-header">
            <div className="user__body-header-user">
              <div className="user__body-header-user-avatar">
                {
                  user?.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" />
                  ) : (
                    <i className="bi bi-person"></i>
                  )
                }
              </div>
              <div className="user__body-header-user-info">
                <span className="user__body-header-user-info-name">
                  {user?.displayName}
                </span>
                <span className="user__body-header-user-info-email">
                  {user?.email}
                </span>
              </div>
            </div>
            <button className="btn geo-btn-outline geo-btn-transparent">
              <i className="bi bi-plus-circle"></i>
              Upload new picture
            </button>
          </div>
        </div>
        <div className="user__body-form">
          <h6 className="user__body-form-title">Full name</h6>
          <div className="user__body-form-item row">
            <div className="user__body-form-item-wrapper col">
              <label className="geo-input-label" htmlFor={"firstName"}>
                First name
              </label>
              <input
                name={"firstName"}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={!canEdit}
                placeholder={"First name"}
                type="text"
                className="geo-dashboard__input geo-input form-control"
                id={"firstName"}
              />
            </div>
            <div className="user__body-form-item-wrapper col">
              <label className="geo-input-label" htmlFor={"lastName"}>
                Last name
              </label>
              <input
                name={"lastName"}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={"Last name"}
                disabled={!canEdit}
                type="text"
                className="geo-dashboard__input geo-input form-control"
                id={"lastName"}
              />
            </div>
          </div>
        </div>
        <div className="user__body-form">
          <h6 className="user__body-form-title">Contact email</h6>
          <div className="user__body-form-item row">
            <div className="user__body-form-item-wrapper col">
              <label className="geo-input-label" htmlFor={"email"}>
                Email
              </label>
              <input
                name={"email"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={"Email"}
                disabled={true}
                type="text"
                className="geo-dashboard__input geo-input form-control"
                id={"email"}
              />
            </div>
            <div className="user__body-form-item-wrapper col">
              <button className="btn geo-btn-outline geo-btn-transparent">
                <i className="bi bi-plus-circle"></i>
                Add another email
              </button>
            </div>
          </div>
        </div>
        <div className="user__body-form">
          <h6 className="user__body-form-title">Password</h6>
          <div className="user__body-form-item row">
            <div className="user__body-form-item-wrapper col">
              <label className="geo-input-label" htmlFor={"currentPassword"}>
                Current Password
              </label>
              <input
                name={"currentPassword"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={"Email"}
                disabled={!canEdit}
                type="password"
                className="geo-dashboard__input geo-input form-control"
                id={"currentPassword"}
              />
            </div>
            <div className="user__body-form-item-wrapper col">
              <label className="geo-input-label" htmlFor={"newPassword"}>
                New Password
              </label>
              <input
                name={"newPassword"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder={"New Password"}
                disabled={!canEdit}
                type="password"
                className="geo-dashboard__input geo-input form-control"
                id={"newPassword"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="user__save">
        <button disabled={!canEdit} className="btn geo-btn-primary">
          Save
        </button>
        <button className="btn geo-btn-transparent geo-btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default User
