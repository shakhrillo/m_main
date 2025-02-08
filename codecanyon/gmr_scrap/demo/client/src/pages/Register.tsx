import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { googleLogin, register } from "../services/authService";
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
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";

import logo from "../assets/logo.svg";

export const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(email, password);
      navigate("/auth/login");
    } catch (error: any) {
      if (typeof error === "string") {
        setError(error);
        return;
      }
      setError(error?.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to log in with Google.");
    }
  };

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
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2>Get Started Now</h2>
            <p>Enter your credentials to access your account.</p>
          </Col>
          <Col md={8} className="mx-auto">
            <Row className="g-3">
              <Col xl={6}>
                <Button className="w-100" onClick={handleGoogleLogin}>
                  <IconBrandGoogleFilled className="me-2" size={20} />
                  Log in with Google
                </Button>
              </Col>
              <Col xl={6}>
                <Button className="w-100" onClick={handleGoogleLogin}>
                  <IconBrandMeta className="me-2" size={20} />
                  Log in with Meta
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md={8} className="mx-auto">
            <div className="auth-divider my-3">or</div>
          </Col>
          <Col md={8} className="mx-auto">
            <Form onSubmit={handleRegister}>
              <FormGroup className="mb-3" controlId="firstName">
                <FormLabel>First name</FormLabel>
                <FormControl
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </FormGroup>
              <FormGroup className="mb-3" controlId="lastName">
                <FormLabel>Last name</FormLabel>
                <FormControl
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </FormGroup>
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
              <FormGroup className="mb-3" controlId="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  pattern=".{6,}"
                  required
                />
                <FormControl.Feedback type={"invalid"}>
                  <IconAlertCircle className="me-2" size={20} />
                  Password must be at least 6 characters long.
                </FormControl.Feedback>
              </FormGroup>
              <Button variant="primary" className="w-100" type="submit">
                Register
              </Button>
              {error && (
                <Alert className="mt-4" variant="danger" role="alert">
                  {error}
                </Alert>
              )}
            </Form>
          </Col>
          <Col md={8} className="mx-auto">
            <Stack
              direction="horizontal"
              gap={1}
              className="mx-auto mt-3 auth-link"
            >
              Already have an account?{" "}
              <NavLink className="text-decoration-none" to="/login">
                Login
              </NavLink>
            </Stack>
          </Col>
        </Row>
      </Container>
    </>
  );
};
