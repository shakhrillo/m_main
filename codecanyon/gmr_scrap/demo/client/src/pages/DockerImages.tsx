import {
  IconDeviceSdCard,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSelectAll,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react"; // React imports for state and effect handling
import { Card, CardBody, Col, Container, Row, Stack } from "react-bootstrap";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { allImages } from "../services/dockerService";
import { userData } from "../services/userService";
import { formatSize } from "../utils/formatSize";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerImages = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [info, setInfo] = useState<any>({});
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "All comments",
      icon: IconMessages,
      value: info.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      value: info.totalOwnerReviews || "0",
    },
    {
      label: "User comments",
      icon: IconMessages,
      value: info.totalUserReviews || "0",
    },
    { label: "Images", icon: IconPhoto, value: info.totalImages || "0" },
  ];

  useEffect(() => {
    const imagesSubscription = allImages().subscribe((data) => {
      console.log("images->", data);
      setImages(data);
      setLoading(false);
    });

    return () => {
      imagesSubscription.unsubscribe();
    };
  }, [search, uid, filter]);

  useEffect(() => {
    const statsSubscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </Container>
  );
};
