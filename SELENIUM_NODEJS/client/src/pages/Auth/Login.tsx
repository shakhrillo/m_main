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
    <div className="login container-fluid d-flex justify-content-center align-items-center position-relative">
      <div className="row">
        <nav className="login__navbar navbar navbar-expand-lg px-5 position-absolute">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="GeoScraper logo" />
          </a>
        </nav>
        <div className="col col-md-6 offset-md-3">
          <div className="login__card card">
            <div className="card-body px-5 py-5">
              <div className="login__card--header">
                <h3>Login</h3>
                <span>Enter your details to get sign in to your account</span>
              </div>
              {/* <div className="text-center my-4">
                <img src={logo} alt="logo" />
              </div> */}
              <form onSubmit={handleLogin}>
                <div className="form-group mb-2">
                  {/* <div className="mb-3 row"> */}
                  {/* <label className="col-sm-3 col-form-label">Email</label> */}
                  {/* <div className="col-sm-9"> */}
                  <input
                    type="text"
                    className="form-control"
                    id="staticEmail"
                    placeholder="Enter email"
                    // value="email@example.com"
                  />
                  {/* </div> */}
                </div>
                <div className="form-group mb-2">
                  {/* <div className="mb-3 row"> */}
                  {/* <label className="col-sm-3 col-form-label">Password</label> */}
                  {/* <div className="col-sm-9"> */}
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                  {/* </div> */}
                </div>
                <div className="d-grid gap-2 mt-4">
                  <button className="btn" type="submit">
                    Sign In
                  </button>
                </div>
              </form>
              {/* <hr /> */}
              <div className="text-center my-3 d-flex flex-column gap-3">
                <span>Or Sign in with</span>
                <button
                  className="btn border d-flex gap-2 justify-content-center"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <i className="bi bi-google"></i>
                  Login with Google
                </button>
              </div>
              <div className="text-center">
                <span>
                  Don't have an account?{" "}
                  <Link to="/auth/register">Register</Link>
                </span>
              </div>
            </div>
          </div>
          <span className="text-nowrap mx-5">
            Copeyright <i className="bi bi-c-circle"></i> GeoScraper 2024 |
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
