import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { googleLogin, login } from "../../services/firebaseService"

const Login: React.FC = () => {
  const { user } = useFirebase()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    redirectToDashboard()
  }, [user])

  function redirectToDashboard() {
    if (user) {
      navigate("/dashboard")
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await login(email, password)
    } catch (error) {
      setError("Email or password is incorrect.")
    }
  }

  async function handleGoogleLogin() {
    try {
      await googleLogin()
    } catch (error) {
      setError("Failed to log in with Google.")
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h3>Login</h3>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-wrap">
                  <label className="form-label" htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
                    className="form-input"
                  />
                </div>
                <div className="form-wrap">
                  <label className="form-label" htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password"
                    className="form-input"
                  />
                </div>
                <button className="button button-primary" type="submit">
                  Sign In
                </button>
                {error && <div className="text-danger py-3">{error}</div>}
                <div className="py-3">
                  <Link to="/auth/reset-password">
                    <button className="button button-link">
                      Forgot password?
                    </button>
                  </Link>
                </div>
              </form>
              <hr />
              <button className="btn btn-primary" onClick={handleGoogleLogin}>
                <i className="bi bi-google me-2"></i>
                Login with Google
              </button>
              <span className="d-block">
                Don't have an account? <Link to="/auth/register">Register</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
