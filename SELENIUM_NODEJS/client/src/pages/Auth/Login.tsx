import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
import "../../style/login.css"
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
    <div className="row login bg-white">
      <div className="col d-flex align-items-center justify-content-center">
        <div className="bg-white card h-100 border-0 flex-grow-1 p-5">
          <div className="card-body">
            <div className="geo-logo">
              <img src={logo} alt="GeoScraper logo" />
            </div>
            <div className="d-flex flex-column gap-3 mt-4">
              <header>
                <h3>Welcome Again!</h3>
                <p>See your growth and get consulting support!</p>
              </header>
              <div className="d-flex flex-column gap-3">
                <button className="btn" onClick={handleGoogleLogin}>
                  <i className="bi-google"></i> Login with Google
                </button>
                <button className="btn">
                  <i className="bi-apple"></i> Login with Apple
                </button>
              </div>
              <div className="or-text-wrapper">
                <div className="line"></div>
                <p className="or-text">or</p>
                <div className="line"></div>
              </div>
              <form onSubmit={handleLogin} className="d-flex flex-column gap-2">
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
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                    />
                    <label htmlFor="flexCheckDefault">Remember me</label>
                  </div>
                  <a href="#">Forgot password?</a>
                </div>
                <button type="submit" className="btn">
                  Login
                </button>
                <span className="mt-3">
                  Not registered?{" "}
                  <Link to={"/auth/register"}>Create an Account</Link>
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

export default Login
