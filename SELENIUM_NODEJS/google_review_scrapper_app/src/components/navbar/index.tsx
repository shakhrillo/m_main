import { getAuth, signInAnonymously } from "firebase/auth";
import { useState, useEffect } from "react";
import { signInAnonymouslyAction } from "../../features/auth/action";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { initFirebase } from "../../features/firebase/actions";

function Navbar() {
  const dispatch = useAppDispatch();
  const [auth, setAuth] = useState({} as any);

  const db = useAppSelector((state) => state.firebase.db);

  useEffect(() => {
    if (!db) return;
    
    dispatch(signInAnonymouslyAction())
  }, [db])

  useEffect(() => {
    dispatch(initFirebase());
  }, [])

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href={'/'}>GMap Review Scrapper</a>
        <ul className="d-flex flex-row gap-3 navbar-nav align-items-center">
          <li className="nav-item">
            <a className="nav-link" href={'/about'}>About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={'/price'}>Pricing</a>
          </li>
          <li className="nav-item">
            <span>|</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-disabled="true" href={'/dashboard'}>
              <span className="badge bg-warning rounded-0">
                Dashboard
              </span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-disabled="true">Log out</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default Navbar
