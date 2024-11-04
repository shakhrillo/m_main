import React, { useEffect, useState } from "react"
import { useFirebase } from "../contexts/FirebaseProvider"
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/images/logo.png"
import "../style/register.css"

const RegisterPage: React.FC = () => {
  //   const { login, user, googleLogin } = useFirebase()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   if (user) {
  //     navigate('/dashboard');
  //   }
  // }, [user, navigate]);

  //   const handleLogin = async (e: React.FormEvent) => {
  //     e.preventDefault()
  //     try {
  //       await login(email, password)
  //       navigate("/dashboard") // Redirect to a protected route after successful login
  //     } catch (error) {
  //       setError("Failed to log in. Please check your email and password.")
  //     }
  //   }

  //   const handleGoogleLogin = async () => {
  //     try {
  //       await googleLogin()
  //       navigate("/dashboard")
  //     } catch (error) {
  //       setError("Failed to log in with Google.")
  //     }
  //   }

  return (
    <div className="row register bg-white">
      <div className="col d-flex align-items-center justify-content-center">
        <div className="bg-white card h-100 border-0 flex-grow-1 p-5">
          <div className="card-body">
            <div className="geo-logo">
              <img src={logo} alt="GeoScraper logo" />
            </div>
            <div className="d-flex flex-column gap-3 mt-4">
              <header>
                <h3>Welcome!</h3>
                <p>
                  Create an account to get started with GeoScraper and start
                  scarping!
                </p>
              </header>
              <form onSubmit={() => {}} className="d-flex flex-column gap-2">
                <div>
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="form-control"
                    id="firstName"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="form-control"
                    id="lastName"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="form-control"
                    id="email"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="form-control"
                      id="password"
                      placeholder="Password"
                    />
                    <span
                      className="input-group-text bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm password"
                    />
                    <span
                      className="input-group-text bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn mt-3">
                  Register
                </button>
                <span className="mt-3">
                  Got an account? <Link to={"/login"}>Login here!</Link>
                </span>
              </form>
              <small>
                <i className="bi-c-circle"></i> 2024 GeoScraper all rights
                reserved
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="col p-3">
        <div className="card h-100 bg-transparent">
          <div className="card-body login-bg"></div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
