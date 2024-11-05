import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.png"
import { useFirebase } from "../../contexts/FirebaseProvider"

const Login: React.FC = () => {
  const { login, user, googleLogin } = useFirebase()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/dashboard") // Redirect to a protected route after successful login
    } catch (error) {
      setError("Failed to log in. Please check your email and password.")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await googleLogin()
      navigate("/dashboard")
    } catch (error) {
      setError("Failed to log in with Google.")
    }
  }

  return (
    <div className="login container-fluid">
      <nav className="login__navbar">
        <a href="#">
          <img
            className="login__navbar-logo"
            src={logo}
            alt="GeoScraper logo"
          />
        </a>
      </nav>
      <div className="login__card">
        <div className="login__card__header">
          <h3 className="login__card-header-title">Login</h3>
          <span className="login__text">
            Enter your details to get sign in to your account
          </span>
        </div>
        <form className="login__card__form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="staticEmail"
              placeholder="Enter email"
              // value="email@example.com"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="login__card__form-submit">
            <button className="btn btn-primary" type="submit">
              Sign In
            </button>
          </div>
        </form>
        <div className="login__card__footer">
          <span className="login__text">Or Sign in with</span>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google"></i>
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
      {/* <span className="text-nowrap mx-5">
        Copeyright <i className="bi bi-c-circle"></i> GeoScraper 2024 | Privacy
        Policy
      </span> */}
    </div>
  )
}

export default Login
