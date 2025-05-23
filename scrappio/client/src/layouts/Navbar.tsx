import { IconCoins } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { userData } from "../services/userService";
import { formatNumber } from "../utils";
import type { IUserInfo } from "../types/userInfo";
import { Logo } from "../components/Logo";
import { Image } from "react-bootstrap";
import { filter, map } from "rxjs";

/**
 * The application navbar.
 * @returns JSX.Element
 */
export const AppNavbar = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  useEffect(() => {
    if (!user || !user.uid) return;

    const unsubscribe = userData(user.uid)
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IUserInfo),
          })),
        ),
      )
      .subscribe((user) => setUserInfo(user[0]));

    return () => unsubscribe.unsubscribe();
  }, [user]);

  return (
    <Navbar expand="lg" bg="white" variant="light">
      <Container>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar" />

        <Navbar.Collapse id="user-navbar">
          <Nav className="ms-auto">
            <NavLink to={"/payments"} className="nav-link">
              <IconCoins size={20} className="text-warning" />
              <small className="fw-bold ms-2">
                {formatNumber(userInfo?.coinBalance)}
              </small>
            </NavLink>

            <NavDropdown
              title={
                <div className="d-inline-block">
                  {userInfo?.photoURL && (
                    <Image
                      src={userInfo?.photoURL}
                      alt="User"
                      width={26}
                      height={26}
                      className="rounded-circle me-2"
                    />
                  )}
                  <span>{userInfo?.displayName}</span>
                </div>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/users/${user.uid}`);
                }}
              >
                Profile
              </NavDropdown.Item>
              {user?.isAdmin && (
                <NavDropdown.Item
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/settings");
                  }}
                >
                  Settings
                </NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/logout");
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
