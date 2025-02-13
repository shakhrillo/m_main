import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { facebookLogin, googleLogin, register } from "../services/authService";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";

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

  async function handleFacebookLogin() {
    try {
      await facebookLogin();
      window.location.reload();
    } catch (error) {
      setError("Failed to log in with Facebook.");
    }
  }

  return (
    <>
      <Container>
        <Card className="my-3">
          <Row>
            <Col md={6} lg={4}>
              <Card.Body>
                <Row className="g-3 row-cols-1">
                  <Col>
                    <h2>Get Started Now</h2>
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
                          <IconBrandGoogleFilled className="me-2" />
                          Continue with Google
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-primary"
                          className="w-100"
                          size="lg"
                          onClick={handleFacebookLogin}
                        >
                          <IconBrandMeta className="me-2" />
                          Continue with Facebook
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <div className="auth-divider my-3">or</div>
                  </Col>
                  <Col>
                    <Form onSubmit={handleRegister}>
                      <FormGroup className="mb-3" controlId="firstName">
                        <FormControl
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          size="lg"
                          required
                        />
                      </FormGroup>
                      <FormGroup className="mb-3" controlId="lastName">
                        <FormControl
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          size="lg"
                          required
                        />
                      </FormGroup>
                      <FormGroup className="mb-3" controlId="email">
                        <FormControl
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          required
                          isInvalid={
                            !!email &&
                            !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
                              email,
                            )
                          }
                          size="lg"
                        />
                      </FormGroup>
                      <FormGroup className="mb-3" controlId="password">
                        <FormControl
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          pattern=".{6,}"
                          size="lg"
                          required
                        />
                        <FormControl.Feedback type={"invalid"}>
                          <IconAlertCircle className="me-2" size={20} />
                          Password must be at least 6 characters long.
                        </FormControl.Feedback>
                      </FormGroup>
                      <FormGroup className="mb-3" controlId="confirmPassword">
                        <FormControl
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          pattern=".{6,}"
                          size="lg"
                          required
                        />
                        <FormControl.Feedback type={"invalid"}>
                          <IconAlertCircle className="me-2" size={20} />
                          Password must be at least 6 characters long.
                        </FormControl.Feedback>
                      </FormGroup>
                      <Button
                        variant="primary"
                        className="w-100"
                        type="submit"
                        size="lg"
                      >
                        Register
                      </Button>
                      {error && (
                        <Alert className="mt-4" variant="danger" role="alert">
                          {error}
                        </Alert>
                      )}
                    </Form>
                  </Col>
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      Already have an account?
                      <NavLink to="/login">Login</NavLink>
                    </Stack>
                  </Col>
                </Row>
              </Card.Body>
            </Col>
            <Col md={6} lg={8} className="d-none d-md-block">
              <Image
                src="https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Login"
                fluid
                className="auth-image rounded-end"
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};
