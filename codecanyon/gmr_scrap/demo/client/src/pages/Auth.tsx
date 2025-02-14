import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { authenticatedUser } from "../services/userService";
import logo from "../assets/logo.svg";

/**
 * Auth page component.
 * @returns JSX.Element
 */
export const Auth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authenticatedUser();
                if (user) {
                    navigate("/scrap");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
    
        fetchUser();
    }, []);

    return <>
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <Image src={logo} alt="Logo" height="30" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/docs">
                            Documentation
                        </Nav.Link>
                    </Nav>
                    <Button variant="warning" className="ms-3">
                        Purchase 39$
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
}