import { IconCopy, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, CardBody, CardHeader, Col, Container, Dropdown, FormControl, InputGroup, Row, Stack } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { allUsers } from "../services/settingService";
import { formatTimestamp } from "../utils/formatTimestamp";
import { IUserInfo } from "../types/userInfo";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const Users = () => {
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const subscribtion = allUsers().subscribe((users) => {
      setUsers(users);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Users</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
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
                keyField="uid"
                bordered={false}
                data={users.map((user) => ({
                  displayName: user.displayName,
                  email: user.email,
                  coinBalance: user.coinBalance,
                  createdAt: formatTimestamp(user.createdAt),
                  uid: user.uid,
                }))}
                columns={[
                  {
                    dataField: "displayName",
                    text: "Display Name",
                    formatter: (cell: any, row: any) => (
                      <NavLink className={"h6 m-0"} to={`/users/${row.uid}`}>{cell}</NavLink>
                    ),
                  },
                  {
                    dataField: "email",
                    text: "Email",
                    formatter: (cell: any) => <div className="d-flex align-items-center">
                      <CopyToClipboard text={cell} onCopy={() => {
                        alert("Copied");
                      }}>
                        <Button variant="outline-primary" className="d-flex">
                          {cell.replace(/^(.{5})(.*)(@.*)$/, "$1...$3")}
                          <div className="ms-2">
                            <IconCopy size={16} />
                          </div>
                        </Button>
                      </CopyToClipboard>
                    </div>
                  },
                  {
                    dataField: "uid",
                    text: "UID",
                    formatter: (cell: any) => <div className="d-flex align-items-center">
                      <CopyToClipboard text={cell} onCopy={() => {
                        alert("Copied");
                      }}>
                        <Button variant="outline-primary" className="d-flex">
                          {cell.replace(/^(.{6})(.*)(.{6})$/, "$1...$3")}
                          <div className="ms-2">
                            <IconCopy size={16} />
                          </div>
                        </Button>
                      </CopyToClipboard>
                    </div>
                  },
                  {
                    dataField: "createdAt",
                    text: "Created At",
                  },
                ]}
                pagination={paginationFactory({
                  sizePerPage: 15,
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
