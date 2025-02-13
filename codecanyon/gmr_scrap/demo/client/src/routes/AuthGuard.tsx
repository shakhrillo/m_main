import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser } from "../services/userService";

/**
 * AuthGuard component.
 */
export const AuthGuard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authenticatedUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (loading) return;
    navigate(user ? "/" : "/login");
  }, [loading, user]);
  
  return loading || !user ? <>
    <h1>Loading...</h1>
    {error && <p>Error: {error}</p>}
  </> : <Outlet />;
};
