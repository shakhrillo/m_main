import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
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
import { NavLink, useOutletContext } from "react-router-dom";
// import { dockerImages } from "../services/dockerService";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { map } from "rxjs";
import { docker } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";
import { formatTimestamp } from "../utils/formatTimestamp";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerImages = () => {
  const { uid } = useOutletContext<User>();
  const [images, setImages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const subscription = docker({
      type: "image",
    })
      .pipe(
        map((data) => {
          return data.map((image: any) => ({
            ...JSON.parse(typeof image.data === "string" ? image.data : "{}"),
            id: image.id,
            updatedAt: image.updatedAt,
          }));
        }),
      )
      .subscribe((data) => {
        setImages(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item>Docker</Breadcrumb.Item>
        <Breadcrumb.Item active>Images</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
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
                keyField="key"
                data={images.map((image) => ({
                  id: image.id,
                  Tags:
                    image.RepoTags && image.RepoTags.length > 0 ? (
                      <NavLink to={`/images/${image.id}`}>
                        {image.RepoTags.map((tag: string) => (
                          <div key={tag}>{tag || "N/A"}</div>
                        ))}
                      </NavLink>
                    ) : (
                      "N/A"
                    ),
                  Created: formatStringDate(image.Created),
                  Size: formatSize(image.Size),
                  Os: image.Os,
                  Architecture: image.Architecture,
                  Variant: image.Variant,
                  updatedAt: formatTimestamp(image.updatedAt),
                }))}
                columns={[
                  {
                    dataField: "Tags",
                    text: "Tags",
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
                  {
                    dataField: "updatedAt",
                    text: "Updated",
                  },
                ]}
                pagination={paginationFactory({
                  sizePerPage: 15,
                  hideSizePerPage: true,
                })}
              />
              {/* <Table hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <NavLink to={`/images/${image.id}`}>
                          {image.RepoTags && image.RepoTags.length > 0
                            ? image.RepoTags.map((tag: string) => (
                                <div key={tag}>{tag || "N/A"}</div>
                              ))
                            : "N/A"}
                        </NavLink>
                      </td>
                      <td>{formatSize(image.Size)}</td>
                      <td>{formatDate(image.Created)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
