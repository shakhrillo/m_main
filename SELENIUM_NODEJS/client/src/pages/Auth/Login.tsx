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
    <div className="auth">
      <nav>
        <a href="/">
          <img className="logo" src={logo} alt="GeoScraper logo" />
        </a>
      </nav>
      <div className="card auth-card">
        <div>
          <h3>Login</h3>
          <span>Enter your details to get sign in to your account</span>
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email"
            />
          </div>
          <div>
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="text"
              id="email"
              value={password}
              onChange={e => e.target.value}
              placeholder="password"
            />
          </div>
          <button className="btn btn-primary mt-2 w-100" type="submit">
            Sign In
          </button>
          {error && <div className="alert alert-danger">{error}</div>}
          <a href="/auth/reset-password">Forgot password?</a>
        </form>
        <div>
          {/* <span>Or Sign in with</span> */}
          <button
            className="btn w-100"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google me-2"></i>
            Login with Google
          </button>
        </div>
        <div className="mt-2">
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
