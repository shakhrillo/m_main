import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogle,
  IconBrandMeta,
} from "@tabler/icons-react";

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
    <div className="container-fluid auth">
      <div className="row">
        <div className="col-md-6">
          <div className="auth-content">
            <h3>Google Map Reviews Scraping Tool</h3>
            <p>Sign in to your account</p>
            <form
              onSubmit={handleLogin}
              noValidate
              className="needs-validation was-validated"
            >
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-control"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  required
                />
                <small className="invalid-feedback">
                  <IconAlertCircle className="me-2" size={20} />
                  Please enter a valid email address.
                </small>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-control"
                  pattern=".{6,}"
                  required
                />
                <small className="invalid-feedback">
                  <IconAlertCircle className="me-2" size={20} />
                  Password must be at least 6 characters long.
                </small>
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Sign In
              </button>
            </form>
            <div className="text-center my-3">Or login with</div>
            <div className="row g-3">
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleGoogleLogin}
                >
                  <IconBrandGoogle className="me-2" size={20} />
                  Google
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleGoogleLogin}
                >
                  <IconBrandMeta className="me-2" size={20} />
                  Meta
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="auth-image"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
