import { Container } from "react-bootstrap";
import { UsersList } from "../components/users/UsersList";

/**
 * Users page component.
 */
export const Users = () => {
  return (
    <Container>
      <UsersList />
    </Container>
  );
};
