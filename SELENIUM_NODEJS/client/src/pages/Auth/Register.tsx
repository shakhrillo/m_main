import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { googleLogin, register } from "../../services/firebaseService"

const Register: React.FC = () => {
  const { user } = useFirebase()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    redirectToDashboard()
  }, [user])

  function redirectToDashboard() {
    if (user) {
      navigate("/dashboard")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    try {
      await register(email, password, firstName, lastName)
      navigate("/auth/login")
    } catch (error: any) {
      if (typeof error === "string") {
        setError(error)
        return
      }
      setError(error?.message)
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
    <div className="auth">
      <nav>
        <a href="/">
          <img className="logo" src={logo} alt="GeoScraper logo" />
        </a>
      </nav>
      <div className="card auth-card">
        <h3>Registration</h3>
        <span>Enter your details below to create your account.</span>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              placeholder="First name"
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              placeholder="Last name"
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="mt-2 w-100 " type="submit">
            Register
          </button>
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
        <div>
          {/* <span className="registration__text">Or register with</span> */}
          <button className="w-100" type="button" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
        </div>
        <div>
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
