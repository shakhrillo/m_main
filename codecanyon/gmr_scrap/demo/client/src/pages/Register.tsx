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
  Image,
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
    <Container fluid>
      <Row>
        <Col md={6}>
          <Container fluid>
            <Row className="vh-100">
              <Col md={12}>
                <Image src={logo} alt="Logo" width="200" />
              </Col>

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
                  <Form>
                    <FormGroup className="mb-3" controlId="email">
                      <Form.Label>First name</Form.Label>
                      <FormControl
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </FormGroup>
                    <FormGroup className="mb-3" controlId="email">
                      <Form.Label>Last name</Form.Label>
                      <FormControl
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </FormGroup>
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
                          !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
                            email,
                          )
                        }
                      />
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
                    <FormGroup className="mb-3" controlId="password">
                      <Form.Label>Confirm Password</Form.Label>
                      <FormControl
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        pattern=".{6,}"
                        required
                      />
                      <Form.Control.Feedback type={"invalid"}>
                        <IconAlertCircle className="me-2" size={20} />
                        Password must be at least 6 characters long.
                      </Form.Control.Feedback>
                    </FormGroup>
                    <Button variant="primary" className="w-100" type="submit">
                      Register
                    </Button>
                    {error && (
                      <Alert variant="danger" role="alert">
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
              <Col md={12} className="mt-auto">
                <p className="text-center text-sm text-gray-600">
                  2025 GMRS, All rights Reserved
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
    // <div className="main">
    //   <Container>
    //     <div className="content">
    //       <h3>Register</h3>
    //       <Card>
    //         <CardBody>
    //           <Form onSubmit={handleRegister}>
    //             <FormGroup className="mb-3" controlId="firstName">
    //               <Form.Label>First name</Form.Label>
    //               <FormControl
    //                 type="text"
    //                 value={firstName}
    //                 onChange={(e) => setFirstName(e.target.value)}
    //                 placeholder="First name"
    //               />
    //             </FormGroup>
    //             <FormGroup className="mb-3" controlId="lastName">
    //               <Form.Label>Last name</Form.Label>
    //               <FormControl
    //                 type="text"
    //                 value={lastName}
    //                 onChange={(e) => setLastName(e.target.value)}
    //                 placeholder="Last name"
    //               />
    //             </FormGroup>
    //             <FormGroup className="mb-3" controlId="email">
    //               <Form.Label>Email</Form.Label>
    //               <FormControl
    //                 type="email"
    //                 value={email}
    //                 placeholder="Enter email"
    //                 onChange={(e) => setEmail(e.target.value)}
    //               />
    //             </FormGroup>
    //             <FormGroup className="mb-3" controlId="">
    //               <Form.Label>Password</Form.Label>
    //               <FormControl
    //                 type="password"
    //                 value={password}
    //                 placeholder="Password"
    //                 onChange={(e) => setPassword(e.target.value)}
    //               />
    //             </FormGroup>
    //             <FormGroup className="mb-3" controlId="">
    //               <Form.Label>Confirm Password</Form.Label>
    //               <FormControl
    //                 type="password"
    //                 value={confirmPassword}
    //                 placeholder="Confirm password"
    //                 onChange={(e) => setConfirmPassword(e.target.value)}
    //               />
    //             </FormGroup>
    //             <Button variant="primary" type="submit">
    //               Register
    //             </Button>
    //             {error && <Alert variant="danger">{error}</Alert>}
    //           </Form>
    //           <div className="mt-2">
    //             <Button
    //               className="button-google"
    //               type="button"
    //               onClick={handleGoogleLogin}
    //             >
    //               Continue with Google
    //             </Button>
    //           </div>
    //           <div className="mt-2">
    //             <span>
    //               Already have an account? <Link to="/auth/login">Login</Link>
    //             </span>
    //           </div>
    //         </CardBody>
    //       </Card>
    //     </div>
    //   </Container>
    // </div>
  );
};
