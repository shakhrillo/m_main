import { getAuth } from "firebase/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Subscription } from "rxjs";
import { filter, map } from "rxjs";
import { usersList } from "../../services/settingService";
import type { IUserInfo } from "../../types/userInfo";
import { UserData } from "./UserData";
import { IconReload } from "@tabler/icons-react";
import { Stack, Button } from "react-bootstrap";

export const UsersList = () => {
  const auth = getAuth();
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  // Store the subscription reference
  const subscriptionRef = useRef<Subscription | null>(null);

  const fetchUsers = useCallback(
    (append = false, lastDocument = null) => {
      if (!auth.currentUser?.uid) return;

      // Unsubscribe from the previous subscription before creating a new one
      subscriptionRef.current?.unsubscribe();

      const subscription = usersList(lastDocument)
        .pipe(
          filter((snapshot) => !!snapshot),
          map((snapshot) => {
            if (snapshot.empty) {
              setIsLastPage(true);
              return [];
            }

            if (snapshot.docs.length < 10) setIsLastPage(true);

            setLastDoc(snapshot.docs.at(-1));
            return snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IUserInfo),
            }));
          }),
        )
        .subscribe((fetchedUsers) => {
          setUsers((prev) =>
            append ? [...prev, ...fetchedUsers] : fetchedUsers,
          );
        });

      subscriptionRef.current = subscription;
    },
    [auth.currentUser?.uid],
  );

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setUsers([]);

    fetchUsers();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [fetchUsers, search, status]);

  const loadMore = () => {
    if (!isLastPage) fetchUsers(true, lastDoc);
  };

  return (
    <div className="users-list">
      {users.map((user) => (
        <UserData key={user.uid} user={user} />
      ))}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button onClick={loadMore} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
