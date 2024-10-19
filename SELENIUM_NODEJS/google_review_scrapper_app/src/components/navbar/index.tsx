import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signOutAction } from "../../features/auth/action";
import { initFirebase } from "../../features/firebase/actions";
import { setUser } from "../../features/auth";
import "../../style/navbar.css";

function Navbar() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const fsapp = useAppSelector((state) => state.firebase.fsapp);

  useEffect(() => {
    if (!fsapp) return;
    
    const auth = getAuth(fsapp);
    onAuthStateChanged(auth, (user) => {
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

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href={'/'}>
          <img src="https://cdn.freebiesupply.com/images/large/2x/amazon-logo-transparent.png" alt="" height="24" />
        </a>
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
            <a className="nav-link" href={'/user'}>User</a>
          </li>
          <li className="nav-item">
            {
              user ? (
                <a className="nav-link" onClick={() => {
                  dispatch(signOutAction())
                }}>Log out</a>
              ) : (
                <a className="nav-link" href={'/auth'}>
                  Log in
                </a>
              )
            }
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default Navbar
