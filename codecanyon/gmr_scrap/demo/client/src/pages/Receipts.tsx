import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Badge,
  Breadcrumb,
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
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink, useOutletContext } from "react-router-dom";
import { paymentsData } from "../services/paymentService";
import { formatAmount } from "../utils/formatAmount";
import { formatDate } from "../utils/formatDate";
import { ReceiptList } from "../components/receipt/ReceiptList";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const Receipts = () => {
  const { uid } = useOutletContext<User>();
  // const [history, setHistory] = useState([] as any[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // useEffect(() => {
  //   const unsubscribe = paymentsData({
  //     uid,
  //     type: ["charge.succeeded", "charge.failed"],
  //   }).subscribe((data) => {
  //     setHistory(data);
  //   });

  //   return () => {
  //     unsubscribe.unsubscribe();
  //   };
  // }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Receipts</Breadcrumb.Item>
      </Breadcrumb>

      <ReceiptList uid={uid} />
      {/* <Row className="g-3">
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
              <BootstrapTable
                bordered={false}
                hover
                keyField="created"
                data={history.map((item, index) => ({
                  ...item,
                  amount: (
                    <NavLink to={`/receipts/${item.id}`}>
                      {formatAmount(item.amount, item.currency)}
                    </NavLink>
                  ),
                  method: (
                    <>
                      {item.payment_method_details.card?.brand}{" "}
                      {item.payment_method_details.card?.last4}
                    </>
                  ),
                  status: (
                    <Badge
                      bg={item.status === "succeeded" ? "success" : "danger"}
                    >
                      {item.status}
                    </Badge>
                  ),

                  key: index,
                }))}
                columns={[
                  {
                    dataField: "amount",
                    text: "Amount",
                  },
                  { dataField: "number", text: "Payment ID" },
                  {
                    dataField: "method",
                    text: "Method",
                  },
                  {
                    dataField: "created",
                    text: "Created",
                    formatter: (cell: number | undefined) => formatDate(cell),
                  },
                  { dataField: "status", text: "Status" },
                ]}
                pagination={paginationFactory({
                  sizePerPage: 10,
                  hideSizePerPage: true,
                })}
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </Container>
  );
};
