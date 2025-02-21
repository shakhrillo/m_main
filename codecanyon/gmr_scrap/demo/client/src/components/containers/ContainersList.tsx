import { IconFilter, IconReload, IconSearch } from "@tabler/icons-react";
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
import { ContainerData } from "./ContainerData";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

interface IContainersList {
  path: "reviews" | "containers" | "scrap" | "images";
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
        
        if (snapshot.docs.length < 10) setIsLastPage(true);

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
    <div className="containers-list">
      <Stack direction="horizontal" className="bg-light p-3 rounded">
        <div className="me-auto">
          <InputGroup>
            <Form.Control type="search" placeholder="Search..." onChange={(e) => searchSubject.next(e.target.value)} />
          </InputGroup>
        </div>
        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="outline-secondary">
            <IconFilter className="me-2" />
            Filter {status ? `(${status})` : ""}
          </Dropdown.Toggle>
          <Dropdown.Menu>
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
        containers.map((comment) => <ContainerData key={comment.id} container={comment} path={path} />)
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
    </div>
  );
};
