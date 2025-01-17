import {
  IconClockHour7Filled,
  IconDatabaseLeak,
  IconDiscFilled,
  IconGalaxy,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
  IconSelectAll,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { allContainers, allImages } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";

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
          {/* Table for displaying reviews based on active filter */}
          {/* <Col md={12}>
            <Card>
              <CardBody>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Repo Tags</th>
                      <th scope="col">Size</th>
                      <th scope="col">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {images.map((image, index) => (
                      <tr key={index}>
                        <td scope="row" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>
                          <NavLink to={`/images/${image.id}`}>
                            {image.RepoTags
                              ? image.RepoTags.map((tag: string) => (
                                  <div key={tag}>{tag}</div>
                                ))
                              : "No tags available"}
                          </NavLink>
                        </td>
                        <td>{formatSize(image.Size)}</td>
                        <td>{formatTimestamp(image.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col> */}
          {images.map((image, index) => (
            <Col md={4} key={index}>
              <Card className="image-item">
                <CardBody>
                  <Stack direction={"horizontal"} gap={3}>
                    <div className="image-item-logo">
                      <IconSelectAll />
                    </div>
                    <Stack gap={1}>
                      <h6>
                        <NavLink to={`/images/${image.id}`}>
                          {image.RepoTags
                            ? image.RepoTags.map((tag: string) => (
                                <div key={tag}>{tag}</div>
                              ))
                            : "No tags available"}
                        </NavLink>
                      </h6>
                      <Stack direction={"horizontal"} gap={1}>
                        <IconDiscFilled size={14}></IconDiscFilled>
                        <span className="image-item-subtitle">
                          {formatSize(image.Size)}
                        </span>
                      </Stack>
                      <p className="m-0">{formatTimestamp(image.updatedAt)}</p>
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
