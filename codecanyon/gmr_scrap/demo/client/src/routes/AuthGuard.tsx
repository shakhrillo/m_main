import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser } from "../services/userService";

/**
 * Protects routes by ensuring only authenticated users can access them.
 */
export const AuthGuard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevents state updates after unmount

    const fetchUser = async () => {
      try {
        const userData = await authenticatedUser();
        if (isMounted) setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (isMounted) setError("Failed to authenticate user.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return <Outlet context={user} />;
};
