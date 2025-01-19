import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
  CardBody,
  CardHeader,
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
import { Statistics } from "../components/Statistics";
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "Total Validates",
      icon: IconInfoCircle,
      value: info.totalValidateInfo || "0",
    },
  ];

  useEffect(() => {
    const reviewSubscription = validatedUrls(uid, {
      type: "info",
      search,
      filter,
    }).subscribe((data) => {
      setReviews(data);
    });

    return () => {
      reviewSubscription.unsubscribe();
    };
  }, [search, uid, filter]);

  useEffect(() => {
    const subscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {/*---Extracted reviews status---*/}
        {stats.map((stat, index) => (
          <Col key={index}>
            <Statistics {...stat} />
          </Col>
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
