import { IconReload, IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
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
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { filter, map, take } from "rxjs";
import { docker, dockerContainers, dockerImages } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";
import { formatTimestamp } from "../utils/formatTimestamp";
import { ContainersList } from "../components/containers/ContainersList";
import { DockerImagesList } from "../components/docker/DockerImagesList";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const ImagesList = () => {
  // const { uid } = useOutletContext<User>();
  const [images, setImages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  // const [lastDoc, setLastDoc] = useState<any>(null);
  // const [isLastPage, setIsLastPage] = useState(false);

  

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Images</Breadcrumb.Item>
      </Breadcrumb>
      <DockerImagesList />
      <Row className="g-3 d-none">
        <Col md={12}>
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

                  {/* <Dropdown.Menu aria-labelledby="dropdown-filter">
                    {FILTER_OPTIONS.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={filter === option.value ? "active" : ""}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu> */}
                </Dropdown>
              </Stack>
            </CardHeader>
            <CardBody>
              <BootstrapTable
                bordered={false}
                hover
                keyField="key"
                data={images.map((image) => ({
                  id: image.id,
                  name: image?.id,
                  Size: formatSize(image?.machine?.Size),
                  Os: image?.machine?.Os,
                  Architecture: image?.machine?.Architecture,
                  Variant: image?.machine?.Variant,
                  Created: image?.machine?.Created,
                }))}
                columns={[
                  {
                    dataField: "name",
                    text: "Name",
                    formatter: (cell: any, row: any) => (
                      <NavLink to={`/images/${row.id}`} className="text-break">
                        {cell}
                      </NavLink>
                    ),
                  },
                  {
                    dataField: "Size",
                    text: "Size",
                  },
                  {
                    dataField: "Os",
                    text: "OS",
                  },
                  {
                    dataField: "Architecture",
                    text: "Architecture",
                  },
                  {
                    dataField: "Variant",
                    text: "Variant",
                  },
                  {
                    dataField: "Created",
                    text: "Created",
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
      {/* {
        !isLastPage && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button onClick={loadMore} variant="outline-primary">
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )
      } */}
    </Container>
  );
};
