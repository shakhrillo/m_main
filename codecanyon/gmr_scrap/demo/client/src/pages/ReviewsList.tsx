import {
  IconCheck,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { Statistics } from "../components/Statistics";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const ReviewsList = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  // const [reviews, setReviews] = useState<IReview[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "All comments",
      icon: IconCheck,
      // value: containers.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      // value: containers.totalOwnerReviews || "0",
    },
    {
      label: "Videos",
      icon: IconMessages,
      // value: containers.totalVideos || "0",
    },
    {
      label: "Images",
      icon: IconPhoto,
      // value: containers.totalImages || "0"
    },
  ];

  useEffect(() => {
    const reviewSubscription = dockerContainers({
      search,
      uid: uid,
      type: "comments",
    }).subscribe((data) => {
      console.log("data", data);
      // setReviews(data);
      setContainers(data);
    });

    return () => {
      reviewSubscription.unsubscribe();
    };
  }, [search, uid]);

  useEffect(() => {
    const statsSubscription = userData(uid).subscribe((data) => {
      // setInfo(data);
    });

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {/*---Extracted reviews status---*/}
        {stats.map((stat, index) => (
          <Col key={index}>{/* <Statistics {...stat} /> */}</Col>
        ))}
        {/*---End: Extracted reviews status---*/}

        {/* Table for displaying reviews based on active filter */}
        <Col xs={12}>
          <Card>
            <CardHeader>
              <Stack direction="horizontal">
                <div className="d-inline-block me-auto">
                  <InputGroup>
                    <InputGroup.Text id="search-icon">
                      <IconSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      id="search"
                      placeholder="Search..."
                      aria-label="Search"
                      aria-describedby="search-icon"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-filter" variant="secondary">
                    Filter
                  </Dropdown.Toggle>

                  <Dropdown.Menu aria-labelledby="dropdown-filter">
                    {FILTER_OPTIONS.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={filter === option.value ? "active" : ""}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Stack>
            </CardHeader>
            <CardBody>
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Title</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map((container, index) => (
                    <tr key={index}>
                      <td scope="row" style={{ width: "40px" }}>
                        {index + 1}
                      </td>
                      <td style={{ width: "130px" }}>
                        {/* <StatusInfo info={review} /> */}
                      </td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/reviews/${container.id}`);
                          }}
                        >
                          {container.title}
                        </a>
                      </td>
                      <td style={{ width: "250px" }}>
                        {formatTimestamp(container.createdAt)}
                      </td>
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
