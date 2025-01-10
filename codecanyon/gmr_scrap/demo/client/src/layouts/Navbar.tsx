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

const AppNavbar = () => {
  const { uid } = useOutletContext<User>();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsubscribe = userData(uid).subscribe((user) => setUser(user));

    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">GMRScrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar" />
        <Navbar.Collapse id="user-navbar">
          <Nav className="ms-auto">
            <NavLink to={"/payments"} className="nav-link">
              <IconCoins size={22} className="text-warning" stroke={2} />
              <span className="fw-bold ms-2">
                {formatNumber(user?.coinBalance)}
              </span>
            </NavLink>
            <NavDropdown
              title={
                <>
                  <IconBell size={22} />
                  <span className="badge bg-info mt-n1 ms-n2 position-absolute">
                    {user?.newNotifications}
                  </span>
                </>
              }
              align={{ sm: "end" }}
            >
              {(user?.notifications || [])?.map((notification, index) => (
                <NavLink
                  to={`/notification/${notification.id}`}
                  key={index}
                  className="dropdown-item"
                >
                  {notification.title}
                </NavLink>
              ))}
            </NavDropdown>
            <NavDropdown title={"Guest"} align={{ sm: "end" }}>
              <NavLink to={"/profile"} className="dropdown-item">
                Profile
              </NavLink>
              <NavLink to={"/settings"} className="dropdown-item">
                Settings
              </NavLink>
              <NavDropdown.Divider />
              <NavLink to={"/logout"} className="dropdown-item">
                Logout
              </NavLink>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
