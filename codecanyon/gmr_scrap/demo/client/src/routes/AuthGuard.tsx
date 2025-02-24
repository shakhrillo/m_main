import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser, userData } from "../services/userService";
import { filter, map, take } from "rxjs";
import { IUserInfo } from "../types/userInfo";
import { Container, Spinner } from "react-bootstrap";

export const AuthGuard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const authUser = await authenticatedUser();
        if (!authUser || !isActive) throw new Error("User not authenticated.");

        const subscription = userData(authUser.uid)
          .pipe(
            filter(Boolean),
            map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as IUserInfo }))?.[0]),
            take(1)
          )
          .subscribe({
            next: user => isActive && setUser(user),
            error: () => isActive && navigate("/auth/login"),
            complete: () => setLoading(false)
          });

        return () => subscription.unsubscribe();
      } catch {
        isActive && navigate("/auth/login");
      }
    })();

    return () => { isActive = false; };
  }, [navigate]);

  return loading ? (
    <Container className="text-center">
      <h5 className="mt-5">Loading...</h5>
      <Spinner animation="grow" />
    </Container>
  ) : <Outlet context={user} />;
};
