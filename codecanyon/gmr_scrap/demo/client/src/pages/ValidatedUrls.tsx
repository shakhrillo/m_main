import {
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
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
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];
export const ValidatedURLs = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [info, setInfo] = useState<any>({});
  const [reviews, setReviews] = useState<IReview[]>([]);
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
    const reviewSubscription = validatedUrls(uid, {
      type: "info",
      search,
      filter,
    }).subscribe((data) => {
      setReviews(data);
      setLoading(false);
    });

    return () => {
      reviewSubscription.unsubscribe();
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
          {/*---Extracted reviews status---*/}
          {stats.map((stat, index) => (
            <Col key={index} md={3}>
              <Card>
                <Card.Body>
                  <Stack direction="horizontal" gap={3}>
                    {createElement(stat.icon, { size: 48, strokeWidth: 1.5 })}
                    <Stack direction="vertical">
                      <Card.Title className="fs-3 m-0">
                        {formatNumber(stat.value)}
                      </Card.Title>
                      <Card.Text>{stat.label}</Card.Text>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {/*---End: Extracted reviews status---*/}

          <Col md={12}>
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
          </Col>

          {/* Table for displaying reviews based on active filter */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
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
                    {reviews.map((review, index) => (
                      <tr key={index}>
                        <td scope="row" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td style={{ width: "130px" }}>
                          <StatusInfo info={review} />
                        </td>
                        <td>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/scrap/${review.id}`);
                            }}
                          >
                            {review.title}
                          </a>
                        </td>
                        <td style={{ width: "250px" }}>
                          {formatTimestamp(review.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Row>
      )}
    </Container>
  );
};
