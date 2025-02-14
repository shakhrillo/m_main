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

export const AppNavbar = () => {
  const user = useOutletContext<User>();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  useEffect(() => {
    if (!user || !user.uid) {
      return;
    }

    const unsubscribe = userData(user.uid).subscribe((user) => {
      console.log("user", user);
      setUserInfo(user);
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [user]);

  return (
    <Navbar expand="lg" bg="primary">
      <Container>
        <Navbar.Brand>GMRScrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar" />

        <Navbar.Collapse id="user-navbar">
          <Nav className="ms-auto">
            <NavLink to={"/payments"} className="nav-link">
              <IconCoins size={22} className="text-warning" stroke={2} />
              <span className="fw-bold ms-2">
                {formatNumber(userInfo?.coinBalance)}
              </span>
            </NavLink>

            <NavLink to={"/payments"} className="nav-link">
              <IconBell size={22} className="text-warning" stroke={2} />
              <span className="fw-bold ms-2">0</span>
            </NavLink>

            <NavDropdown
              title={userInfo?.displayName}
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
  );
};
