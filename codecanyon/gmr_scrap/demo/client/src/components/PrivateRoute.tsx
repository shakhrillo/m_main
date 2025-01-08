import { User } from "firebase/auth";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser } from "../services/userService";

const PrivateRoute: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authenticatedUser();

      if (!user) {
        navigate("/login");
      }

      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return loading ? <div>Loading...</div> : <Outlet context={user} />;
};

export default PrivateRoute;
