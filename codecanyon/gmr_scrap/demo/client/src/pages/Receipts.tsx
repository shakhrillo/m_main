import { IconSearch } from "@tabler/icons-react";
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
} from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { receiptData } from "../services/paymentService";
import { formatAmount } from "../utils/formatAmount";
import { formatTimestamp } from "../utils/formatTimestamp";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const Receipts = () => {
  const { uid } = useOutletContext<User>();
  const [history, setHistory] = useState([] as any[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const unsubscribe = receiptData({}).subscribe((data) => {
      console.log(data);
      setHistory(data);
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  return (
    <Container fluid>
      <Row className="g-3">
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
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>Created</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.key}>
                      <td>{index + 1}</td>
                      <td>
                        <NavLink to={`/receipts/${item.id}`}>{item.id}</NavLink>
                      </td>
                      <td>{formatTimestamp(item.createdAt)}</td>
                      <td>{item.type}</td>
                      <td>
                        {item.status === "succeeded" ? (
                          <span className="text-success">Succeeded</span>
                        ) : (
                          <span className="text-danger">Failed</span>
                        )}
                      </td>
                      <td>{formatAmount(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
