import { Breadcrumb, Container, Dropdown, FormControl, InputGroup, Row, Stack } from "react-bootstrap";
import { UsersList } from "../components/users/UsersList";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const Users = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Users</Breadcrumb.Item>
      </Breadcrumb>
      
      <UsersList />
    </Container>
  );
};
