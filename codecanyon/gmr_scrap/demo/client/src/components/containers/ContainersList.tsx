import { IconSearch } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { NavLink } from "react-router-dom";
import { StatusInfo } from "../../components/StatusInfo";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { formatDate } from "../../utils/formatDate";
import formatNumber from "../../utils/formatNumber";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { Ratings } from "../Ratings";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const ContainersList = ({
  path,
  type,
  machineType,
}: {
  path: "reviews" | "containers" | "scrap";
  type?: "comments" | "info";
  machineType?: "container" | "image";
}) => {
  const auth = getAuth();
  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!auth.currentUser || !auth.currentUser?.uid) {
      return;
    }
    
    setContainers([]);

    const subscription = dockerContainers({
      search,
      uid: auth.currentUser?.uid,
      type,
      machineType,
      status: filter,
    }).subscribe((data) => {
      console.log("data", data);
      setContainers(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [search, auth, type, filter]);

  return (
    <Card>
      <CardHeader>
        <Stack direction="horizontal">
          <div className="d-inline-block me-auto">
            <InputGroup>
              <InputGroup.Text id="searchContainers" className="bg-transparent">
                <IconSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                id="search"
                placeholder="Search containers"
                aria-label="Search"
                aria-describedby="searchContainers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-filter" variant="secondary">
              Filter {filter ? `(${filter})` : ""}
            </Dropdown.Toggle>

            <Dropdown.Menu aria-labelledby="dropdown-filter">
              {FILTER_OPTIONS.map((option) => (
                <Dropdown.Item
                  key={option.label}
                  onClick={() => setFilter(option.value)}
                  className={filter === option.value ? "active" : ""}
                >{ option.label }</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          {
            filter && containers.length === 0 && (
              <div>
                No containers found with status: {filter}
              </div>
            )
          }
          {
            filter && containers.length > 0 && (
              <div>
                Showing containers with status: {filter}
              </div>
            )
          }
        </div>
        <BootstrapTable
          bordered={false}
          hover
          keyField="containerId"
          data={containers.map((comment) => ({
            containerId: comment.containerId,
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
                  {comment.title || comment.tag || comment.machineId}
                  {comment.type && (
                    <Badge
                      className="text-capitalize ms-2"
                      bg={comment.type === "info" ? "info" : "primary"}
                    >
                      {comment.type === "info" ? "Validate" : "Review"}
                    </Badge>
                  )}
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
