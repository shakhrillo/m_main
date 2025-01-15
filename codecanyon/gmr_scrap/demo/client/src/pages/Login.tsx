import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";
import logo from "../assets/logo_1.svg";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Image,
  Row,
} from "react-bootstrap";

export const Login: React.FC = () => {
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
    setError(null);

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
    <Container fluid>
      <Row>
        {/* Left Side: Authentication Section */}
        <Col md={6} className="auth">
          <Image src={logo} alt="Logo" width="200" className="auth-logo" />
          <div className="auth-content">
            <Form onSubmit={handleLogin} noValidate className="auth-form">
              {/* Error Message */}
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              {/* Header */}
              <div className="auth-header">
                <div>
                  <h2 className="auth-title">Get Started Now</h2>
                  <p className="auth-subtitle">
                    Enter your credentials to access your account.
                  </p>
                </div>

                {/* Social Login Buttons */}
                <Row className="g-3">
                  <Col>
                    <Button
                      className="button-outline w-100"
                      onClick={handleGoogleLogin}
                    >
                      <IconBrandGoogleFilled className="me-2" size={20} />
                      Log in with Google
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="button-outline w-100"
                      onClick={handleGoogleLogin}
                    >
                      <IconBrandMeta className="me-2" size={20} />
                      Log in with Meta
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Divider */}
              <div className="text-center my-3 position-relative">
                <hr />
                <span className="auth-devider">or</span>
              </div>

              {/* Login Form */}
              <div>
                <FormGroup className="mb-3" controlId="email">
                  <Form.Label className="input-label">Email</Form.Label>
                  <FormControl
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    required
                    isInvalid={
                      !!email &&
                      !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)
                    }
                  />

                  <Form.Control.Feedback type={"invalid"}>
                    <IconAlertCircle className="me-2" size={20} />
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="mb-3" controlId="password">
                  <Form.Label className="input-label">Password</Form.Label>
                  <FormControl
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    pattern=".{6,}"
                    required
                  />
                  <Form.Control.Feedback type={"invalid"}>
                    <IconAlertCircle className="me-2" size={20} />
                    Password must be at least 6 characters long.
                  </Form.Control.Feedback>
                  <div className="text-end">
                    <Link to={"#"} className="auth-link">
                      Forgot password?
                    </Link>
                  </div>
                </FormGroup>
              </div>

              {/* Submit Button */}
              <Button variant="primary" className="w-100" type="submit">
                Login
              </Button>

              {/* Register Link */}
              <div className="text-center mt-3 auth-link">
                Don't have an account?{" "}
                <Link className="text-decoration-none" to="/register">
                  Create an account
                </Link>
              </div>
            </Form>
          </div>
          {/* Footer */}
          <div className="auth-footer">
            <p>2025 GMRS, All right Reserved</p>
          </div>
        </Col>

        {/* Right Side: Illustration */}
        <Col md={6}>
          <div className="auth-image"></div>
        </Col>
      </Row>
    </Container>
  );
};
