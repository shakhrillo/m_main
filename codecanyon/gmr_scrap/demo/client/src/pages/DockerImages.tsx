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
import { allImages } from "../services/dockerService";
import { formatDate } from "../utils/formatDate";
import { formatSize } from "../utils/formatSize";
import { IconCheck, IconSearch } from "@tabler/icons-react";
import { Statistics } from "../components/Statistics";
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

  const stats = [
    {
      label: "Total Images",
      icon: IconCheck,
      value: 10,
    },
  ];

  useEffect(() => {
    const subscription = allImages().subscribe((data) => {
      setImages(data);
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
              <Table hover responsive>
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
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
