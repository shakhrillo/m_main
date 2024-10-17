import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerEmailAndPasswordAction, signInEmailAndPasswordAction, signInWithGoogleAction } from "../../features/auth/action";

function AuthView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if(!user) return;
    window.location.href = '/dashboard'
  }, [user])

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h2>Register</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const email = (document.getElementById("register-email") as HTMLInputElement).value;
            const password = (document.getElementById("register-password") as HTMLInputElement).value;
            dispatch(registerEmailAndPasswordAction({ email, password }))
          }}
          className="d-flex flex-column gap-3"
          >
            <div className="form-group">
              <label htmlFor="register-email">Email address</label>
              <input type="email" className="form-control" id="register-email" aria-describedby="emailHelp" />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input type="password" className="form-control" id="register-password" />
            </div>
            <div className="form-group">
              <label htmlFor="register-password-confirm">Confirm Password</label>
              <input type="password" className="form-control" id="register-password-confirm" />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-6">
          <h2>Sign in</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const email = (document.getElementById("signin-email") as HTMLInputElement).value;
            const password = (document.getElementById("signin-password") as HTMLInputElement).value;
            dispatch(signInEmailAndPasswordAction({ email, password }))
          }}
          className="d-flex flex-column gap-3"
          >
            <div className="form-group">
              <label htmlFor="signin-email">Email address</label>
              <input type="email" className="form-control" id="signin-email" aria-describedby="emailHelp" />
            </div>
            <div className="form-group">
              <label htmlFor="signin-password">Password</label>
              <input type="password" className="form-control" id="signin-password" />
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
          </form>
        </div>
      </div>

      <hr />

      {/* Login with google */}
      <div className="row">
        <div className="col-6">
          <button className="btn btn-primary" onClick={() => dispatch(signInWithGoogleAction())}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}
export default AuthView
