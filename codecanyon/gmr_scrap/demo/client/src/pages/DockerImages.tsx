import { IconDeviceSdCard, IconSelectAll } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Stack } from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { allImages } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";
import { formatTimestamp } from "../utils/formatTimestamp";

export const DockerImages = () => {
  const { uid } = useOutletContext<User>();
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const imagesSubscription = allImages().subscribe((data) => {
      setImages(data);
    });

    return () => {
      imagesSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {images.map((image, index) => (
          <Col md={4} key={index}>
            <Card>
              <CardBody>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="d-flex rounded p-3 bg-primary-subtle">
                    <IconSelectAll
                      className="text-primary"
                      size={40}
                      strokeWidth={1.5}
                    />
                  </div>
                  <Stack>
                    <NavLink
                      to={`/images/${image.id}`}
                      className={"h6 text-primary"}
                    >
                      {image.RepoTags && image.RepoTags.length > 0
                        ? image.RepoTags.map((tag: string) => (
                            <div key={tag}>{tag || "N/A"}</div>
                          ))
                        : "N/A"}
                    </NavLink>
                    <Stack
                      direction={"horizontal"}
                      gap={2}
                      className="text-muted"
                    >
                      <IconDeviceSdCard size={20} />
                      <p className="m-0">{formatSize(image.Size)}</p>
                    </Stack>
                    <small className="m-0">
                      {formatTimestamp(image.updatedAt)}
                    </small>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
