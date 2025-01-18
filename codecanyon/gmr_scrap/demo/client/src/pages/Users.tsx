import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Table } from "react-bootstrap";
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
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Display Name</th>
                    <th>Email</th>
                    <th>Coin Balance</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index}</td>
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
