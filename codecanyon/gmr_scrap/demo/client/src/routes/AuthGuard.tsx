import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser } from "../services/userService";

export const AuthGuard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authenticatedUser();
      setLoading(false);
      setUser(user);

      if (!user) {
        // navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return loading ? <div>Loading...</div> : <Outlet context={user} />;
};
