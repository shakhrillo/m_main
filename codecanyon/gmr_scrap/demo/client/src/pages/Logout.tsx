import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/firebaseService";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    logout().then(() => {
      navigate("/auth/login");
    });
  }, []);

  return (
    <div className="container">
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
