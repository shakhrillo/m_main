import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Image,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { allUsers } from "../services/settingService";
import { formatTimestamp } from "../utils/formatTimestamp";
import { NavLink } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const subscribtion = allUsers().subscribe((users) => {
      console.log("users", users);
      setUsers(users);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Display Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Coin Balance</th>
                    <th scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        <NavLink to={`/users/${user.id}`}>
                          {user.displayName}
                        </NavLink>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.coinBalance}</td>
                      <td>{formatTimestamp(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
