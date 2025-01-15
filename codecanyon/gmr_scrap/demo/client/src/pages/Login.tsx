import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";
import logo from "../assets/logo_1.svg";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Image,
  Row,
  Stack,
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
        <Col md={6} className="auth">
          <Image src={logo} alt="Logo" width="200" className="auth-logo" />
          <Stack className="auth-content my-auto">
            <Form onSubmit={handleLogin} noValidate className="auth-form">
              <Stack gap={4}>
                <Stack>
                  <h2>Get Started Now</h2>
                  <p>Enter your credentials to access your account.</p>
                </Stack>

                <Row className="g-3">
                  <Col>
                    <Button className="w-100" onClick={handleGoogleLogin}>
                      <IconBrandGoogleFilled className="me-2" size={20} />
                      Log in with Google
                    </Button>
                  </Col>
                  <Col>
                    <Button className="w-100" onClick={handleGoogleLogin}>
                      <IconBrandMeta className="me-2" size={20} />
                      Log in with Meta
                    </Button>
                  </Col>
                </Row>
              </Stack>
              <div className="auth-divider my-3">or</div>
              <Stack>
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
                  <div className="text-end">
                    <NavLink to="#">Forgot password?</NavLink>
                  </div>
                </FormGroup>
              </Stack>

              <Button variant="primary" className="w-100" type="submit">
                Login
              </Button>
              {error && (
                <Alert variant="danger" role="alert">
                  {error}
                </Alert>
              )}

              <Stack
                direction="horizontal"
                gap={1}
                className="mx-auto mt-3 auth-link"
              >
                Don't have an account?{" "}
                <NavLink className="text-decoration-none" to="/register">
                  Create an account
                </NavLink>
              </Stack>
            </Form>
          </Stack>
          <Stack
            direction="horizontal"
            className="flex flex-none justify-content-center"
          >
            <p className="text-center text-sm text-gray-600">
              2025 GMRS, All rights Reserved
            </p>
          </Stack>
        </Col>

        <Col md={6} className="d-none d-md-block">
          <div className="auth-image"></div>
        </Col>
      </Row>
    </Container>
  );
};
