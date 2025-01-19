import { IconCheck, IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { Statistics } from "../components/Statistics";
import { allContainers } from "../services/dockerService";
import { formatTimestamp } from "../utils/formatTimestamp";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerContainers = () => {
  const { uid } = useOutletContext<User>();
  const [containers, setContainers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "Total Containers",
      icon: IconCheck,
      value: 10,
    },
  ];

  useEffect(() => {
    const subscription = allContainers().subscribe((data) => {
      setContainers(data);
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

        <Col xs={12}>
          <Card>
            <CardHeader>
              <Stack direction="horizontal">
                <div className="d-inline-block me-auto">
                  <InputGroup>
                    <InputGroup.Text id="search-icon">
                      <IconSearch />
                    </InputGroup.Text>
                    <FormControl
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
