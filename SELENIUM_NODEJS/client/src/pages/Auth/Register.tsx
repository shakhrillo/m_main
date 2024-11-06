import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
import { useFirebase } from "../../contexts/FirebaseProvider"

const Register: React.FC = () => {
  const { register, user, googleLogin } = useFirebase()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      setError("All fields are required.")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    try {
      await register(email, password, firstName, lastName);
      navigate("/auth/login")
    } catch (error) {
      setError("Failed to create an account.")
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
        <form className="registration__card__form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
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
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="registration__card__form-submit">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
        <div className="registration__card__footer">
          <span className="registration__text">Or register with</span>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google me-2"></i>
            Continue with Google
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
