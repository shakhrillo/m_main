import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { filter, map, take } from "rxjs";
import { usersList } from "../../services/settingService";
import { IUserInfo } from "../../types/userInfo";
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

  const fetchUsers = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    return usersList(lastDocument).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return [];
        }
        
        if (snapshot.docs.length < 10) setIsLastPage(true);
  
        setLastDoc(snapshot.docs.at(-1));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IUserInfo }));
      }),
      take(1),
    ).subscribe((users) => {
      console.log(users);
      setUsers((prev) => (append ? [...prev, ...users] : users));
    });
  };

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setUsers([]);
    const subscription = fetchUsers();
    return () => subscription?.unsubscribe();
  }, [search, status]);

  const loadMore = () => {
    if (!isLastPage) fetchUsers(true, lastDoc);
  };

  return (
    <div className="users-list">
      {users.map((user) => <UserData key={user.uid} user={user} />)}

      {
        !isLastPage && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button onClick={loadMore} variant="outline-primary">
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )
      }
    </div>
  )
} 