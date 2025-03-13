import { useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Button, Image } from "react-bootstrap";
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
            <Button className="ms-auto">Purchase $49</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};
