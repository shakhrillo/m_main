import React, { useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"

const User: React.FC = () => {
  const { user } = useFirebase()

  const [firstName, setFirstName] = useState("Léane")
  const [lastName, setLastName] = useState("Lejeune")
  const [email, setEmail] = useState("leane_93@domain.tld")
  const [password, setPassword] = useState("password123")
  const [newPassword, setNewPassword] = useState("password1234")

  const [canEdit, setCanEdit] = useState(false)

  return (
    <div className="user">
      <div className="user__wrapper">
        <div className="user__header">
          <div className="user__header__text">
            <h5 className="user__header__text__title">Account</h5>
            <span className="user__header__text__subtitle">
              Real-time information and activities of your property
            </span>
          </div>
          <div className="user__header__btns">
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
          <div className="user__body__header">
            <div className="user__body__header__user">
              <div className="user__body__header__user__avatar">
                <i className="bi bi-person"></i>
              </div>
              <div className="user__body__header__user__info">
                <span className="user__body__header__user__info__name">
                  Léane Lejeune
                </span>
                <span className="user__body__header__user__info__email">
                  leane_93@domain.tld
                </span>
              </div>
            </div>
            <button className="btn geo-btn-outline geo-btn-transparent">
              <i className="bi bi-plus-circle"></i>
              Upload new pictire
            </button>
          </div>
          {/* <img src="" alt="" /> */}
        </div>
        <div className="user__body__form">
          <h6 className="user__body__form__title">Full name</h6>
          <div className="user__body__form__item row">
            <div className="user__body__form__item__wrapper col">
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
            <div className="user__body__form__item__wrapper col">
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
        <div className="user__body__form">
          <h6 className="user__body__form__title">Contact email</h6>
          <div className="user__body__form__item row">
            <div className="user__body__form__item__wrapper col">
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
            <div className="user__body__form__item__wrapper col">
              <button className="btn geo-btn-outline geo-btn-transparent">
                <i className="bi bi-plus-circle"></i>
                Add another email
              </button>
            </div>
          </div>
        </div>
        <div className="user__body__form">
          <h6 className="user__body__form__title">Password</h6>
          <div className="user__body__form__item row">
            <div className="user__body__form__item__wrapper col">
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
            <div className="user__body__form__item__wrapper col">
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
      {/* <div className="card-body">
        <h5 className="card-title">User information</h5>
        <p>
          <strong>{user?.email}</strong>
        </p>
        <div className="alert alert-info" role="alert">
          This is a demo project. All the data is stored in a public database.
        </div>
        {!user?.emailVerified ? (
          <div className="alert alert-warning" role="alert">
            Email is not verified. Please verify your email address.
          </div>
        ) : null}
        <div className="mt-4">
          <button
            className="btn btn-danger"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete your account?")
              ) {
                user?.delete()
              }
            }}
          >
            Delete profile
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default User
