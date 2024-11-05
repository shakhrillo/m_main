import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
import { useFirebase } from "../../contexts/FirebaseProvider"

const Register: React.FC = () => {
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
    <div className="registration container-fluid">
      <nav className="registration__navbar">
        <a href="#">
          <img
            className="registration__navbar-logo"
            src={logo}
            alt="GeoScraper logo"
          />
        </a>
      </nav>
      <div className="registration__card">
        <div className="registration__card__header">
          <h3 className="registration__card__header-title">Registration</h3>
          <span className="registration__text">
            Enter your details below to create your account.
          </span>
        </div>
        <form className="registration__card__form" onSubmit={() => {}}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
            />
          </div>
          <div className="registration__card__form-submit">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>
        <div className="registration__card__footer">
          <span className="registration__text">Or register with</span>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google me-2"></i>
            Register with Google
          </button>
        </div>
        <div className="registration__text">
          <span>
            Already have an account?{" "}
            <Link className="registration__card__link" to="/auth/login">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register
