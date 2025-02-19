import { IconReload, IconSearch } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { StatusInfo } from "../../components/StatusInfo";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { formatNumber, formatTimestamp } from "../../utils";
import { Ratings } from "../Ratings";
import { debounceTime, filter, map, Subject, take } from "rxjs";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

interface IContainersList {
  path: "reviews" | "containers" | "scrap";
  type?: "comments" | "info";
  machineType?: "container" | "image";
}

const searchSubject = new Subject<string>();

export const ContainersList = ({ path, type, machineType }: IContainersList) => {
  const auth = getAuth();
  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const subscription = searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      setSearch(value);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchSubject.next(e.target.value);
  };

  const fetchContainers = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    return dockerContainers({
      search: search.trim().toLowerCase(),
      uid: auth.currentUser.uid,
      type,
      machineType,
      status,
    }, lastDocument).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return [];
        }
        setLastDoc(snapshot.docs.at(-1));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }));
      }),
      take(1),
    ).subscribe((data) => {
      setContainers((prev) => (append ? [...prev, ...data] : data));
    });
  };

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setContainers([]);
    const subscription = fetchContainers();
    return () => subscription?.unsubscribe();
  }, [search, type, status, machineType]);

  const loadMore = () => {
    if (!isLastPage) fetchContainers(true, lastDoc);
  };

  return (
    <>
      <Stack className="mb-3" direction="horizontal">
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
              onChange={handleSearch}
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

      {
        status && (
          <div className="text-muted">
            {containers.length === 0 
              ? `No containers found with status: ${status}` 
              : `Showing containers with status: ${status}`}
          </div>
        )
      }

      {
        containers.map((comment) => (
          <Card key={comment.machineId} className="mb-3">
            <CardBody>
              <Stack direction="horizontal" gap={2} className="justify-content-between">
                {
                  path === "containers" ? (
                    <Stack direction="horizontal" gap={2}>
                      <Badge className="text-capitalize" bg={comment.type === "comments" ? "info" : "warning"}>
                        {comment.type}
                      </Badge>
                      <Badge
                        bg={
                          comment.machine?.Action === "die" ? "danger" : comment.machine?.Action === "start" ? "success" : "secondary"
                        }
                        className="text-capitalize"
                      >
                        {comment.machine?.Action}
                      </Badge>
                    </Stack>
                  ) : (
                    <StatusInfo container={comment} />
                  )
                }
                <small>
                  {formatTimestamp(comment.createdAt)}
                </small>
              </Stack>
              <NavLink className={"h6"} to={`/${path}/${comment.machineId}`}>
                {
                  path === "containers" ? (
                    <>
                      {comment.title}
                    </>
                  ) : (
                    comment.title
                  )
                }
              </NavLink>
              {
                path === "containers" ? (
                  <>
                    <Stack direction="horizontal" gap={2} className="text-muted">
                      {comment?.machine?.Actor?.Attributes?.name && (
                        <i className="text-capitalize">
                          #{comment?.machine?.Actor?.Attributes?.name}
                        </i>
                      )}
                      {(comment?.machine?.Actor?.Attributes?.execDuration || 0) + "s exec duration"}
                    </Stack>
                  </>
                ) : (
                  <>
                    <Ratings container={comment} />
                    {
                      comment.type === "comments" && (
                        <Stack direction="horizontal" gap={2} className="text-muted">
                          <div>{formatNumber(comment.totalReviews)} Reviews</div>
                          <div>{formatNumber(comment.totalOwnerReviews)} Owner Reviews</div>
                          <div>{formatNumber(comment.totalImages)} Images</div>
                          <div>{formatNumber(comment.totalVideos)} Videos</div>
                        </Stack>
                      )
                    }
                  </>
                )
              }
            </CardBody>
          </Card>
        ))
      }

      {
        !isLastPage && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button onClick={loadMore} variant="outline-primary">
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )
      }
    </>
  );
};
