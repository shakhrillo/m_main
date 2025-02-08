import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { facebookLogin, googleLogin, login } from "../services/authService";
import {
  IconAlertCircle,
  IconBrandGoogleFilled,
  IconBrandMeta,
} from "@tabler/icons-react";
import logo from "../assets/logo.svg";
import {
  Alert,
  Button,
  Card,
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
        <Card className="auth-card mt-3">
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
                          <IconBrandGoogleFilled className="me-2" size={20} />
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
                        <FormControl
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
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

                        <FormControl.Feedback type={"invalid"}>
                          <IconAlertCircle className="me-2" size={20} />
                          Please enter a valid email address.
                        </FormControl.Feedback>
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

                      <Button
                        variant="primary"
                        className="w-100"
                        type="submit"
                        size="lg"
                      >
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
                    <Stack direction="horizontal" gap={2}>
                      Don't have an account?
                      <NavLink to="/register">Create an account</NavLink>
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
