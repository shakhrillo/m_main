import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUser } from "../../features/auth";
import { getUserTokenAction, signOutAction } from "../../features/auth/action";
import { initFirebase } from "../../features/firebase/actions";
import "../../style/navbar.css";

import logoImg from "../../assets/logo.svg";

function Navbar() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const fsapp = useAppSelector((state) => state.firebase.fsapp);

  useEffect(() => {
    if (!fsapp) return;
    
    const auth = getAuth(fsapp);
    onAuthStateChanged(auth, (user) => {
      dispatch(getUserTokenAction());
      
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  }, [fsapp])

  useEffect(() => {
    dispatch(initFirebase());
  }, [])

  function handleClick() {
    if (user) {
      dispatch(signOutAction());
    } else {
      window.location.href = '/auth';
    }
  }

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand p-0" href={'/'}>
          {/* <img src={logoImg} alt="logo" height="40" /> */}
        </a>
        <button className="btn btn-outline-secondary me-2" type="button" onClick={handleClick}>
          {user ? 'Log out' : 'Log in'}
        </button>
      </div>
    </nav>
  )
}
export default Navbar
