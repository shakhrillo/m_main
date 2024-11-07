import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.png"
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
    <div className="login container-fluid">
      <nav className="login__navbar">
        <a href="/">
          <img
            className="login__navbar-logo"
            src={logo}
            alt="GeoScraper logo"
          />
        </a>
      </nav>
      <div className="login__card">
        <div className="login__card__header">
          <h3 className="login__card__header-title">Login</h3>
          <span className="login__text">
            Enter your details to get sign in to your account
          </span>
        </div>
        <form className="login__card__form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login__card__form-submit">
            <button className="btn btn-primary" type="submit">
              Sign In
            </button>
          </div>
          {
            error && <div className="alert alert-danger">{error}</div>
          }
          <a className="login__card__link" href="/auth/reset-password">
            Forgot password?
          </a>
        </form>
        <div className="login__card__footer">
          <span className="login__text">Or Sign in with</span>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google me-2"></i>
            Login with Google
          </button>
        </div>
        <div className="login__text">
          <span>
            Don't have an account?{" "}
            <Link className="login__card__link" to="/auth/register">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
