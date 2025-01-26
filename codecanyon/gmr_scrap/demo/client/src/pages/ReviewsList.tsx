import {
  IconCheck,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
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
import { NavLink, useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { dockerContainers } from "../services/dockerService";
import { userData } from "../services/userService";
import { IDockerContainer } from "../types/dockerContainer";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

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
        {/* {stats.map((stat, index) => (
          <Col key={index}>
            <Statistics {...stat} />
          </Col>
        ))} */}
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
              <BootstrapTable
                bordered={false}
                hover
                keyField="id"
                data={containers.map((comment) => ({
                  title: (
                    <NavLink to={`/reviews/${comment.machineId}`}>
                      {comment.title}
                    </NavLink>
                  ),
                  status: <StatusInfo container={comment} />,
                  date: formatTimestamp(comment.createdAt),
                }))}
                columns={[
                  { dataField: "title", text: "Title" },
                  { dataField: "status", text: "Comment" },
                  { dataField: "date", text: "Date" },
                ]}
                pagination={paginationFactory({
                  sizePerPage: 10,
                  hideSizePerPage: true,
                })}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
