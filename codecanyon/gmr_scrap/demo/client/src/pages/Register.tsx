import type React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogin, register } from "../services/authService";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import {
  Alert,
  Button,
  Form,
  FormControl,
  FormGroup,
  Stack,
} from "react-bootstrap";

/**
 * Register page component.
 */
export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(formData.email, formData.password);
      navigate("/auth/login");
    } catch {
      setError("Failed to register.");
    }
  };

  const handleOAuthRegister = async () => {
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch {
      setError("Failed to register with Google.");
    }
  };

  return (
    <div className="auth">
      <div className="auth-form">
        <div className="auth-title">Create an account</div>
        <p className="auth-subtitle">
          Join us today! It only takes a few steps.
        </p>

        <Button
          variant="outline-secondary"
          className="w-100"
          onClick={handleOAuthRegister}
        >
          <IconBrandGoogleFilled className="me-2" /> Continue with Google
        </Button>

        <div className="auth-divider my-3">or</div>

        <Form onSubmit={handleSubmit} className="mb-3">
          <FormGroup className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <FormControl
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <FormControl
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <FormControl
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <FormControl
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </FormGroup>

          <Button variant="primary" className="w-100" type="submit">
            Register
          </Button>

          {error && <Alert variant="danger mt-4">{error}</Alert>}
        </Form>

        <Stack direction="horizontal" gap={2}>
          Already have an account?
          <NavLink to="/auth/login">Login</NavLink>
        </Stack>
      </div>
    </div>
  );
};
