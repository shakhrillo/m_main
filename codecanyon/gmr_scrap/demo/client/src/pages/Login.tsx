import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";
import logo from "../assets/logo.svg";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Nav,
  Navbar,
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
      window.location.reload();
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
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <Image src={logo} alt="Logo" width="150" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/docs">
                Documentation
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact
              </Nav.Link>
            </Nav>
            <Button variant="warning" className="ms-3">
              Purchase 39$
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row>
          <Col md={4} className="mx-auto">
            <Row className="row-cols-1">
              <Col>
                <h2 className="mt-3">Get Started Now</h2>
                <p>Enter your credentials to access your account.</p>
              </Col>
              <Col>
                <Row className="row-cols-1 g-3">
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      size="lg"
                      onClick={handleGoogleLogin}
                    >
                      <IconBrandGoogleFilled className="me-2" size={20} />
                      Continue with Google
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      size="lg"
                      onClick={handleGoogleLogin}
                    >
                      <IconBrandMeta className="me-2" size={20} />
                      Continue with Facebook
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col>
                <div className="auth-divider my-3">or</div>
              </Col>
              <Col>
                <Form onSubmit={handleLogin}>
                  <FormGroup className="mb-3" controlId="email">
                    <FormLabel>Email</FormLabel>
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

                    <FormControl.Feedback type={"invalid"}>
                      <IconAlertCircle className="me-2" size={20} />
                      Please enter a valid email address.
                    </FormControl.Feedback>
                  </FormGroup>

                  <FormGroup className="mb-3" controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      pattern=".{6,}"
                      required
                    />
                    <FormControl.Feedback type={"invalid"}>
                      <IconAlertCircle className="me-2" size={20} />
                      Password must be at least 6 characters long.
                    </FormControl.Feedback>
                  </FormGroup>

                  <Button variant="primary" className="w-100" type="submit">
                    Login
                  </Button>
                  {error && (
                    <Alert variant="danger mt-4" role="alert">
                      {error}
                    </Alert>
                  )}
                </Form>
              </Col>
              <Col>
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
              </Col>
              <Col>
                <p className="text-center text-sm text-gray-600">
                  2025 GMRS, All rights Reserved
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};
