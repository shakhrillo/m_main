import type React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogin, login } from "../services/authService";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import {
  Alert,
  Button,
  Form,
  FormControl,
  FormGroup,
  Stack,
} from "react-bootstrap";
import type { UserCredential } from "firebase/auth";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "user@user.com",
    password: "123456",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate("/scrap");
    } catch {
      setError("Email or password is incorrect.");
    }
  };

  const handleOAuthLogin = async (provider: () => Promise<UserCredential>) => {
    try {
      await provider();
      navigate("/scrap");
    } catch {
      setError("Failed to log in.");
    }
  };

  return (
    <div className="auth">
      <div className="auth-form">
        <div className="auth-title">Login to your account</div>
        <p className="auth-subtitle">
          Welcome back! We're happy to see you again.
        </p>

        <Button
          variant="outline-secondary"
          className="w-100"
          onClick={() => handleOAuthLogin(googleLogin)}
        >
          <IconBrandGoogleFilled className="me-2" /> Continue with Google
        </Button>

        <div className="auth-divider my-3">or</div>

        <Form onSubmit={handleSubmit} className="mb-3">
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
            <Form.Text>
              Admin: admin@admin.com <br />
              User: user@user.com
            </Form.Text>
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
            <Form.Text>
              Admin: 123456 <br />
              User: 123456
            </Form.Text>
          </FormGroup>

          <Button variant="primary" className="w-100" type="submit">
            Login
          </Button>

          {error && <Alert variant="danger mt-4">{error}</Alert>}
        </Form>

        <Stack direction="horizontal" gap={2}>
          Don't have an account?
          <NavLink to="/auth/register">Create an account</NavLink>
        </Stack>
      </div>
    </div>
  );
};
