import { IconBell, IconCoins } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { useFirebase } from "../../contexts/FirebaseProvider";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import { userCoins } from "../../services/coinService";

const AppNavbar: FC = () => {
  const { user, firestore } = useFirebase();

  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = userCoins(user?.uid).subscribe((balance) => {
      setBalance(balance);
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [user]);

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="user-navbar" />
        <Navbar.Collapse id="user-navbar">
          <Nav className="ms-auto">
            <NavLink to={"/payments"} className="nav-link">
              <IconCoins size={22} className="text-warning" stroke={2} />
              <span className="fw-bold ms-2">{balance}</span>
            </NavLink>
            <NavDropdown
              title={
                <>
                  <IconBell size={22} />
                  <span className="badge bg-info mt-n1 ms-n2 position-absolute">
                    3
                  </span>
                </>
              }
              align={{ sm: "end" }}
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={user ? user.displayName : "Guest"}
              align={{ sm: "end" }}
            >
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
