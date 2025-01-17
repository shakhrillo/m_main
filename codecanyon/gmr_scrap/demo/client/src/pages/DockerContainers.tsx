import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Table } from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { allContainers } from "../services/dockerService";
import { formatTimestamp } from "../utils/formatTimestamp";

export const DockerContainers = () => {
  const { uid } = useOutletContext<User>();
  const [containers, setContainers] = useState<any[]>([]);

  useEffect(() => {
    const containersSubscription = allContainers().subscribe((data) => {
      setContainers(data);
    });

    return () => {
      containersSubscription.unsubscribe();
    };
  }, [uid]);

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
                    <th scope="col">Id</th>
                    <th scope="col">Action</th>
                    <th scope="col">Type</th>
                    <th scope="col">From</th>
                    <th scope="col">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map((container, index) => (
                    <tr key={index}>
                      <td scope="row" style={{ width: "40px" }}>
                        {index + 1}
                      </td>
                      <td>
                        <span
                          style={{ maxWidth: "150px" }}
                          className="d-inline-block text-truncate"
                        >
                          <NavLink to={`/containers/${container.id}`}>
                            {container.id}
                          </NavLink>
                        </span>
                      </td>
                      <td>{container.Action}</td>
                      <td>{container.type}</td>
                      <td>{container.from}</td>
                      <td>{formatTimestamp(container.updatedAt)}</td>
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
