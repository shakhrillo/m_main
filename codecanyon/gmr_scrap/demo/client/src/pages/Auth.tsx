import { useEffect, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { authenticatedUser } from "../services/userService";
import logo from "../assets/logo_scrappio.png";

/**
 * Auth page component.
 * Redirects authenticated users to the scrap page.
 */
export const Auth = () => {
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const user = await authenticatedUser();
      if (user) navigate("/scrap");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <Image src={logo} alt="Scrappio Logo" height="30" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/docs">Documentation</Nav.Link>
            </Nav>
            <Button className="ms-3">Purchase $39</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
