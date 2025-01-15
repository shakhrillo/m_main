import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogle,
  IconBrandMeta,
} from "@tabler/icons-react";
import logo from "../assets/logo.svg";
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
        <Col md={6}>
          <div className="auth-content">
            <Image src={logo} alt="_Logo" width="200" className="mb-5" />
            <h3>Welcome!</h3>
            <p>Sign in to your account</p>
            <Form
              onSubmit={handleLogin}
              noValidate
              className="needs-validation was-validated"
            >
              <FormGroup className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <FormControl
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  required
                  isInvalid={
                    !email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
                  }
                />
                <Form.Control.Feedback type={"invalid"}>
                  <IconAlertCircle className="me-2" size={20} />
                  Please enter a valid email address.
                </Form.Control.Feedback>
              </FormGroup>
              <FormGroup className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <FormControl
                  type="password"
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
              </FormGroup>
              <Button variant="primary" className="w-100" type="submit">
                Sign In
              </Button>
            </Form>
            <div className="text-center my-3">Or login with</div>
            <Row className="g-3">
              <Col>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleGoogleLogin}
                >
                  <IconBrandGoogle className="me-2" size={20} />
                  Google
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleGoogleLogin}
                >
                  <IconBrandMeta className="me-2" size={20} />
                  Meta
                </Button>
              </Col>
            </Row>
            <div className="text-center mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="auth-image"></div>
        </Col>
      </Row>
    </Container>
  );
};
