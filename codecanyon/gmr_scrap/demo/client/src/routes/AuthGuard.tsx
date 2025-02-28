import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authenticatedUser, userData } from "../services/userService";
import { from, filter, map, switchMap, catchError, of } from "rxjs";
import { IUserInfo } from "../types/userInfo";
import { Container, Spinner } from "react-bootstrap";

export const AuthGuard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = from(authenticatedUser())
      .pipe(
        switchMap((authUser) => {
          if (!authUser) {
            navigate("/auth/login");
            return of(null);
          }
          return userData(authUser.uid).pipe(
            filter(Boolean),
            map(
              (snapshot) =>
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...(doc.data() as IUserInfo),
                }))?.[0],
            ),
            catchError(() => {
              navigate("/auth/login");
              return of(null);
            }),
          );
        }),
      )
      .subscribe({
        next: (user) => {
          setUser(user);
          setLoading(false);
        },
        error: () => navigate("/auth/login"),
      });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return loading ? (
    <Container className="text-center">
      <h5 className="mt-5">Loading...</h5>
      <Spinner animation="grow" />
    </Container>
  ) : (
    <Outlet context={user} />
  );
};
