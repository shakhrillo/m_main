import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  Form,
  InputGroup,
  Stack,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink, useOutletContext } from "react-router-dom";
import { StatusInfo } from "../../components/StatusInfo";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { formatDate } from "../../utils/formatDate";
import formatNumber from "../../utils/formatNumber";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { Ratings } from "../Ratings";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const ContainersList = ({
  path,
  type,
}: {
  path: "reviews" | "containers" | "scrap";
  type?: "comments" | "info";
}) => {
  const user = useOutletContext<User>();
  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const subscription = dockerContainers({
      search,
      // uid: uid,
      type,
    }).subscribe((data) => {
      console.log(data);
      setContainers(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [search, user, type]);

  return (
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
          keyField="key"
          data={containers.map((comment) => ({
            title: (
              <NavLink to={`/${path}/${comment.machineId}`}>
                {comment.title}
              </NavLink>
            ),
            status: <StatusInfo container={comment} />,
            date: formatTimestamp(comment.createdAt),
            rating: <Ratings container={comment} />,
            totalReviews: formatNumber(comment.totalReviews),
            totalOwnerReviews: formatNumber(comment.totalOwnerReviews),
            totalImages: formatNumber(comment.totalImages),
            totalVideos: formatNumber(comment.totalVideos),
            machineAction: (
              <Badge
                bg={
                  comment.machine?.Action === "die"
                    ? "danger"
                    : comment.machine?.Action === "start"
                      ? "success"
                      : "secondary"
                }
                className="text-capitalize"
              >
                {comment.machine?.Action}
              </Badge>
            ),
            machineTime: formatDate(comment?.machine?.time || 0),
            machineExecDuration:
              (comment?.machine?.Actor?.Attributes?.execDuration || 0) + "s",
            machineImage: comment?.machine?.Actor?.Attributes?.image,
            machineName: (
              <span className="d-flex flex-column">
                <NavLink to={`/${path}/${comment.machineId}`}>
                  {comment.title}
                  {
                    <Badge
                      className="text-capitalize ms-2"
                      bg={comment.type === "info" ? "info" : "primary"}
                    >
                      {comment.type === "info" ? "Validate" : "Review"}
                    </Badge>
                  }
                </NavLink>
                #{comment?.machine?.Actor?.Attributes?.name}
              </span>
            ),
          }))}
          columns={[
            ...(type ? [{ dataField: "title", text: "Title" }] : []),
            ...(type ? [{ dataField: "status", text: "Comment" }] : []),
            ...(type ? [{ dataField: "date", text: "Date" }] : []),
            ...(type === "info" ? [{ dataField: "rating", text: "Rate" }] : []),
            ...(type === "comments"
              ? [{ dataField: "totalReviews", text: "Reviews" }]
              : []),
            ...(type === "comments"
              ? [{ dataField: "totalImages", text: "Images" }]
              : []),
            ...(type === "comments"
              ? [{ dataField: "totalVideos", text: "Videos" }]
              : []),
            ...(type === "comments"
              ? [{ dataField: "totalOwnerReviews", text: "Owner response" }]
              : []),
            ...(!type ? [{ dataField: "machineName", text: "Machine" }] : []),
            ...(!type
              ? [{ dataField: "machineAction", text: "Machine Action" }]
              : []),
            ...(!type
              ? [{ dataField: "machineTime", text: "Machine Time" }]
              : []),
            ...(!type
              ? [
                  {
                    dataField: "machineExecDuration",
                    text: "Machine Exec Duration",
                  },
                ]
              : []),
            ...(!type
              ? [{ dataField: "machineImage", text: "Machine Image" }]
              : []),
          ]}
          pagination={paginationFactory({
            sizePerPage: 10,
            hideSizePerPage: true,
          })}
        />
      </CardBody>
    </Card>
  );
};
