import React, { ChangeEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  deleteAccountAction,
  updateAccountPasswordAction,
} from "../../features/auth/action"

import "../../style/user.scss"

const UsersView: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>("")

  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)

  useEffect(() => {}, [])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target && e.target.result) {
          setImageSrc(e.target.result.toString())
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="profile container d-flex flex-column gap-3">
      <h1 className="profile__title">User</h1>

      <div className="profile__card card border">
        <div className="profile__user-info card-body d-flex justify-content-between align-items-center">
          <div className="profile__user-details d-flex align-items-center gap-3">
            <div className="profile__image">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="profile__image-img rounded-circle"
                />
              ) : (
                <div className="profile__image-placeholder w-100 h-100 d-flex justify-content-center align-items-center rounded-circle">
                  <i className="bi-person"></i>
                </div>
              )}
              <div
                className="profile__image-edit-icon"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <i className="bi-pencil"></i>
              </div>
              <input
                type="file"
                id="file-input"
                className="profile__image-input d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="profile__name d-flex flex-column gap-1">
              <span className="profile__name-first">Joseph Bishop</span>
              <span className="profile__name-location">United States</span>
            </div>
          </div>

          <div className="profile__user-meta d-flex flex-column gap-2">
            <div className="profile__balance d-flex">
              <span>Balance: </span>
              <span>{user?.balance || 0} seconds</span>
            </div>
            <div className="profile__uid d-flex">
              <span>UID: </span>
              <span>{user?.uid}</span>
            </div>
          </div>

          <button className="profile__edit-button edit-info border py-2 px-3 d-flex gap-2">
            <span>Edit</span>
            <i className="bi-pencil"></i>
          </button>
        </div>
      </div>

      <div className="profile__card card border">
        <div className="card-body row">
          <div className="profile__information">
            <div className="profile__information-header d-flex justify-content-between">
              <span>Personal Information</span>
              <button className="profile__edit-button edit-info border py-2 px-3 d-flex gap-2">
                <span>Edit</span>
                <i className="bi-pencil"></i>
              </button>
            </div>
            <div className="profile__information-grid">
              <div className="profile__info-item">
                <span>First name</span>
                <h5>Joseph</h5>
              </div>
              <div className="profile__info-item">
                <span>Last name</span>
                <h5>Bishop</h5>
              </div>
              <div className="profile__info-item">
                <span>Email address</span>
                <h5>{user?.email}</h5>
              </div>
              <div className="profile__info-item">
                <span>Phone</span>
                <h5>+09 345 346 46</h5>
              </div>
              <div className="profile__info-item">
                <span>Bio</span>
                <h5>Team Manager</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile__card card border">
        <div className="card-body row">
          <div className="profile__address">
            <div className="profile__address-header d-flex justify-content-between">
              <span>Address</span>
              <button className="profile__edit-button edit-info border py-2 px-3 d-flex gap-2">
                <span>Edit</span>
                <i className="bi-pencil"></i>
              </button>
            </div>
            <div className="profile__address-grid">
              <div className="profile__info-item">
                <span>Country</span>
                <h5>United Kingdom</h5>
              </div>
              <div className="profile__info-item">
                <span>City / State</span>
                <h5>Leeds, East London</h5>
              </div>
              <div className="profile__info-item">
                <span>Postal Code</span>
                <h5>ERT 2354</h5>
              </div>
              <div className="profile__info-item">
                <span>TAX ID</span>
                <h5>AS4564576</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // {/* <div className="card">
    //   <div className="card-body">
    //     <p>
    //       <strong>Balance: </strong>
    //       <span className="badge bg-primary">
    //         {user?.balance || 0} seconds
    //       </span>
    //     </p>
    //     <hr />
    //     <p>
    //       <strong>UID:</strong> {user?.uid}
    //     </p>
    //     <p>
    //       <strong>Email:</strong> {user?.email}
    //     </p>

    //     <hr />

    //     <h5>User form</h5>
    //     <form>
    //       <div className="mb-3">
    //         <label htmlFor="email" className="form-label">
    //           Email address
    //         </label>
    //         <input
    //           type="email"
    //           className="form-control"
    //           id="email"
    //           aria-describedby="emailHelp"
    //           disabled
    //           placeholder={user?.email}
    //         />
    //       </div>
    //       <div className="mb-3">
    //         <label htmlFor="password" className="form-label">
    //           Password
    //         </label>
    //         <input type="password" className="form-control" id="password" />
    //       </div>
    //       <button
    //         type="submit"
    //         className="btn btn-primary"
    //         onClick={e => {
    //           dispatch(
    //             updateAccountPasswordAction({
    //               password: (
    //                 document.getElementById("password") as HTMLInputElement
    //               ).value,
    //             }),
    //           )
    //         }}
    //       >
    //         Change password
    //       </button>
    //     </form>

    //     <hr />

    //     <h5>Delete account</h5>
    //     <button
    //       className="btn btn-danger"
    //       onClick={() => {
    //         dispatch(deleteAccountAction())
    //       }}
    //     >
    //       Delete account
    //     </button>
    //   </div>
    // </div> */}
  )
}

export default UsersView
