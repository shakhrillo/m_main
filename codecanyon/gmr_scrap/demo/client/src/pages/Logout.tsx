import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

/**
 * Logout page component.
 * @returns JSX.Element
 */
export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      navigate("/auth/login");
    });
  }, [navigate]);

  return (
    <Container className="text-center">
      <h5 className="mt-5">Logging out...</h5>
      <Spinner animation="grow" />
    </Container>
  );
};
