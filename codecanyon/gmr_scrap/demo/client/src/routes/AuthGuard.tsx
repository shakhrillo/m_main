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
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [loading, user]);

  return loading || !user ? <div>Loading...</div> : <Outlet context={user} />;
};
