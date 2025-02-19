import { IconSearch } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, CardHeader, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { StatusInfo } from "../../components/StatusInfo";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { formatDate, formatNumber, formatTimestamp } from "../../utils";
import { Ratings } from "../Ratings";
import { filter, map, take } from "rxjs";

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
  const [status, setStatus] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (!auth.currentUser || !auth.currentUser?.uid) {
      return;
    }
    
    setLastDoc(null);
    setIsLastPage(false);
    setContainers([]);

    const subscription = dockerContainers({
      search,
      uid: auth.currentUser?.uid,
      type,
      machineType,
      status,
    }).pipe(
      filter((snapshot) => snapshot !== null),
      map((snapshot) => {
        const docs = snapshot.docs;

        if (snapshot.empty) {
          setIsLastPage(true);
        }

        setLastDoc(docs[docs.length - 1]);
        return docs.map((doc) => {
          const data = doc.data() as IDockerContainer;
          return {
            id: doc.id,
            ...data,
          };
        });
      })
    ).subscribe((data) => setContainers(data));

    return () => {
      subscription.unsubscribe();
    };
  }, [search, auth, type, status, machineType]);

  function loadMore() {
    if (!auth.currentUser || !auth.currentUser?.uid) {
      return;
    }

    const subscription = dockerContainers({
      search,
      uid: auth.currentUser?.uid,
      type,
      machineType,
      status,
    }, lastDoc).pipe(
      filter((snapshot) => snapshot !== null),
      map((snapshot) => {
        const docs = snapshot.docs;

        if (snapshot.empty) {
          setIsLastPage(true);
        }

        setLastDoc(docs[docs.length - 1]);
        return docs.map((doc) => {
          const data = doc.data() as IDockerContainer;
          return {
            id: doc.id,
            ...data,
          };
        });
      }),
      filter((data) => data.length > 0),
      take(1),
    ).subscribe((data) => setContainers([...containers, ...data]));

    return () => {
      subscription.unsubscribe();
    };
  }

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
            <Dropdown.Toggle id="dropdown-status" variant="secondary">
              Filter {status ? `(${status})` : ""}
            </Dropdown.Toggle>

            <Dropdown.Menu aria-labelledby="dropdown-status">
              {FILTER_OPTIONS.map((option) => (
                <Dropdown.Item
                  key={option.label}
                  onClick={() => setStatus(option.value)}
                  className={status === option.value ? "active" : ""}
                >{ option.label }</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          {
            status && containers.length === 0 && (
              <div>
                No containers found with status: {status}
              </div>
            )
          }
          {
            status && containers.length > 0 && (
              <div>
                Showing containers with status: {status}
              </div>
            )
          }
        </div>
        <div>
          {
            containers.map((comment) => ({
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
            })).map((comment) => (
              <div key={comment.containerId}>
                {/* <NavLink to={`/${path}/${comment.machineId}`}>
                  {comment.title}
                </NavLink> */}
                {comment.status}
                {comment.date}
                {comment.rating}
                {comment.totalReviews}
                {comment.totalOwnerReviews}
                {comment.totalImages}
                {comment.totalVideos}
                {comment.machineAction}
                {comment.machineTime}
                {comment.machineExecDuration}
                {comment.machineImage}
                {comment.machineName}
              </div>
            ))
          }

          {
            !isLastPage && (
              <Button onClick={loadMore} variant="outline-primary" className="mt-3">
                Load more
              </Button>
            )
          }
        </div>
      </CardBody>
    </Card>
  );
};
