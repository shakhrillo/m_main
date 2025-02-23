import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser, userData } from "../services/userService";
import { filter, map, take } from "rxjs";
import { IUserInfo } from "../types/userInfo";

/**
 * Protects routes by ensuring only authenticated users can access them.
 */
export const AuthGuard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    
    const fetchUser = async () => {
      try {
        const user = await authenticatedUser();
        if (!user || !isSubscribed) return;

        const subscription = userData(user.uid)
          .pipe(
            filter((snapshot) => !!snapshot),
            map((snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IUserInfo }))),
            take(1)
          )
          .subscribe({
            next: (users) => {
              if (users.length > 0 && isSubscribed) {
                setUser(users[0]);
              }
            },
            error: (err) => {
              if (isSubscribed) setError("Failed to fetch user data.");
              console.error("Error fetching user data:", err);
            },
            complete: () => setLoading(false),
          });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.info("Error authenticating user:", err);
        if (isSubscribed) setError("Failed to authenticate user.");
      }
    };

    fetchUser();

    return () => {
      isSubscribed = false;
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
