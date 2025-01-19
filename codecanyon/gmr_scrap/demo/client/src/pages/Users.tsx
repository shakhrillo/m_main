import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  FormControl,
  Image,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { allUsers } from "../services/settingService";
import { formatTimestamp } from "../utils/formatTimestamp";
import { NavLink } from "react-router-dom";
import { IconCheck, IconSearch } from "@tabler/icons-react";
import { Statistics } from "../components/Statistics";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "Total Receipts",
      icon: IconCheck,
      value: 10,
    },
  ];

  useEffect(() => {
    const subscribtion = allUsers().subscribe((users) => {
      console.log("users", users);
      setUsers(users);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

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
                    <th scope="col">Display Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Coin Balance</th>
                    <th scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        <NavLink to={`/users/${user.id}`}>
                          {user.displayName}
                        </NavLink>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.coinBalance}</td>
                      <td>{formatTimestamp(user.createdAt)}</td>
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
