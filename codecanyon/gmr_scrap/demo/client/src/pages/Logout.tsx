import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { Spinner } from "react-bootstrap";

export const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      navigate("/auth/login");
    });
  }, []);

  return (
    <div className="container text-center">
      <h5 className="mt-5">Logging out...</h5>
      <Spinner animation="grow" />
    </div>
  );
};
