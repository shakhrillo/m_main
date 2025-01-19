import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Table } from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { allImages } from "../services/dockerService";
import { formatDate } from "../utils/formatDate";
import { formatSize } from "../utils/formatSize";

export const DockerImages = () => {
  const { uid } = useOutletContext<User>();
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const subscription = allImages().subscribe((data) => {
      setImages(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image, index) => (
                    <tr key={index}>
                      <td>
                        <NavLink to={`/images/${image.id}`}>
                          {image.RepoTags && image.RepoTags.length > 0
                            ? image.RepoTags.map((tag: string) => (
                                <div key={tag}>{tag || "N/A"}</div>
                              ))
                            : "N/A"}
                        </NavLink>
                      </td>
                      <td>{formatSize(image.Size)}</td>
                      <td>{formatDate(image.Created)}</td>
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
