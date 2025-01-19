import { IconBell, IconCoins } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useOutletContext } from "react-router-dom";
import { IUser, userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";

export const AppNavbar = ({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { uid } = useOutletContext<User>();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsubscribe = userData(uid).subscribe((user) => setUser(user));

    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  return (
    <div {...rest}>
      <Navbar variant="dark" bg="primary" className="h-100">
        <Container>
          <Navbar.Brand>GMRScrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="user-navbar" />

          <Navbar.Collapse id="user-navbar">
            <Nav className="ms-auto">
              <NavLink to={"/payments"} className="nav-link">
                <IconCoins size={22} className="text-warning" stroke={2} />
                <span className="fw-bold ms-2">
                  {formatNumber(user?.coinBalance)}
                </span>
              </NavLink>

              <NavLink to={"/payments"} className="nav-link">
                <IconBell size={22} className="text-warning" stroke={2} />
                <span className="fw-bold ms-2">0</span>
              </NavLink>

              <NavDropdown
                title={user?.displayName}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
