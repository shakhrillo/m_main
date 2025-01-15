import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin, register } from "../services/authService";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormControl,
  FormGroup,
} from "react-bootstrap";

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
    <div className="main">
      <Container>
        <div className="content">
          <h3>Register</h3>
          <Card>
            <CardBody>
              <Form onSubmit={handleRegister}>
                <FormGroup className="mb-3" controlId="firstName">
                  <Form.Label>First name</Form.Label>
                  <FormControl
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </FormGroup>
                <FormGroup className="mb-3" controlId="lastName">
                  <Form.Label>Last name</Form.Label>
                  <FormControl
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </FormGroup>
                <FormGroup className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <FormControl
                    type="email"
                    value={email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-3" controlId="">
                  <Form.Label>Password</Form.Label>
                  <FormControl
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-3" controlId="">
                  <Form.Label>Confirm Password</Form.Label>
                  <FormControl
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormGroup>
                <Button variant="primary" type="submit">
                  Register
                </Button>
                {error && <Alert variant="danger">{error}</Alert>}
              </Form>
              <div className="mt-2">
                <Button
                  className="button-google"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </div>
              <div className="mt-2">
                <span>
                  Already have an account? <Link to="/auth/login">Login</Link>
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};
