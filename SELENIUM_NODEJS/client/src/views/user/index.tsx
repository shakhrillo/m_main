import { doc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseProvider"
import "../../style/user.scss"

const UsersView: React.FC = () => {
  const [userInformation, setUserInformation] = useState({} as any);
  const { user, firestore } = useFirebase();

  useEffect(() => {
    if (!firestore || !user) return;
    const userDoc = doc(firestore, `users/${user.uid}`);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      setUserInformation(doc.data());
    });

    return () => {
      unsubscribe();
    };

  }, [firestore, user]);

  return (
    <div className="profile">
      <div className="profile__card card">
        <div className="profile__user-info card-body d-flex justify-content-between align-items-center">
          <div className="profile__user-details d-flex align-items-center gap-3">
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
              <span className="profile__name-first">
                {user?.email}
              </span>
              <span className="profile__name-location">
                {user?.displayName || "No name"}
              </span>
            </div>
          </div>

          <div className="profile__user-meta d-flex flex-column gap-2">
            <div className="profile__balance d-flex">
              <span>Balance: </span>
              <span>{userInformation?.coinBalance || 0} coins</span>
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
    </div>
  )
}

export default UsersView
