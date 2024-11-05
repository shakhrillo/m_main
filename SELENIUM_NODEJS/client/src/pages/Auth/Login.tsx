import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.svg"
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
    <div className="container">
      <div className="row">
        <div className="col col-md-6 offset-md-3">
          <div className="card mt-5">
            <div className="card-body">
              <div className="text-center mb-4">
                <img src={logo} alt="logo" height="50" />
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="staticEmail" value="email@example.com" />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" />
                </div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="button">
                  Login
                </button>
              </div>
              <hr />
              <div className="text-center">
                <p>
                  Don't have an account? <Link to="/auth/register">Register</Link>
                </p>
                <p>or</p>
                <button className="btn btn-danger" type="button" onClick={handleGoogleLogin}>
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
