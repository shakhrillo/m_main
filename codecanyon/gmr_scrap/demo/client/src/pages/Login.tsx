import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";

const Login: React.FC = () => {
  const user = useOutletContext<User>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    navigate("/scrap");
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (error) {
      setError("Email or password is incorrect.");
    }
  }

  async function handleGoogleLogin() {
    try {
      await googleLogin();
      window.location.reload();
    } catch (error) {
      setError("Failed to log in with Google.");
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col col-md-6 col-lg-5 mx-auto">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Sign In</h1>
              <p className="text-center">Sign in to your account</p>
              <hr />
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Sign In
                </button>
                {error && <div className="text-danger mt-3">{error}</div>}
                <div className="mt-3 text-center">
                  <Link to="/auth/reset-password" className="btn btn-link">
                    Forgot password?
                  </Link>
                </div>
              </form>
              <hr />
              <button
                className="btn btn-outline-primary w-100 mb-3"
                onClick={handleGoogleLogin}
              >
                <i className="bi bi-google me-2"></i>
                Login with Google
              </button>
              <p className="text-center mb-0">
                Don't have an account?{" "}
                <Link to="/auth/register" className="text-primary">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
