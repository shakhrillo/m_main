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
import {
  NavLink,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { allContainers, dockerContainerStats } from "../services/dockerService";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerContainer = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const { containerId } = useParams() as { containerId: string };

  const [info, setInfo] = useState<any>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const containersSubscription = dockerContainerStats(containerId).subscribe(
      (data) => {
        console.log("stats->", data);
        setStats(data);
        setLoading(false);
      },
    );

    return () => {
      containersSubscription.unsubscribe();
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
          <Col>
            <Card>
              <CardBody>
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Id</th>
                      <th scope="col">Type</th>
                      <th scope="col">From</th>
                      <th scope="col">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((e, index) => (
                      <tr key={index}>
                        <td scope="row" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        {/* <td>
                          <span
                            style={{ maxWidth: "150px" }}
                            className="d-inline-block text-truncate"
                          >
                            <NavLink to={`/containers/${container.id}`}>
                              {container.id}
                            </NavLink>
                          </span>
                        </td>
                        <td>{container.type}</td>
                        <td>{container.from}</td>
                        <td>{formatTimestamp(container.updatedAt)}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
