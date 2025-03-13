import { IconFilter, IconReload } from "@tabler/icons-react";
import type { JSX } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { dockerContainers } from "../../services/dockerService";
import type { IDockerContainer } from "../../types/dockerContainer";
import type { Subscription } from "rxjs";
import { debounceTime, filter, map, Subject } from "rxjs";
import { ContainerData } from "./ContainerData";
import type { IUserInfo } from "../../types/userInfo";

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

/**
 * ContainersList component
 * @param {string} path - Path
 * @param {string} type - Type (comments | info)
 * @param {string} machineType - Machine type (container | image)
 * @returns {JSX.Element} - ContainersList component
 */
export const ContainersList = ({
  path,
  type,
  machineType,
}: IContainersList): JSX.Element => {
  const user = useOutletContext<IUserInfo>();
  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    const searchSubscription = searchSubject
      .pipe(debounceTime(300))
      .subscribe(setSearch);
    return () => searchSubscription.unsubscribe();
  }, []);

  const fetchContainers = useCallback(
    (append = false, lastDocument = null) => {
      if (!user?.uid) return;

      subscriptionRef.current?.unsubscribe();

      subscriptionRef.current = dockerContainers(
        {
          search: search.trim().toLowerCase(),
          uid: !user.isAdmin ? user?.uid : undefined,
          type,
          machineType,
          status,
        },
        lastDocument,
      )
        .pipe(
          filter((snapshot) => !!snapshot),
          map((snapshot) => {
            const docs = snapshot.docs;
            setIsLastPage(docs.length < 10);
            if (!docs.length) return [];

            setLastDoc(docs.at(-1));
            return docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }));
          }),
        )
        .subscribe((newContainers) => {
          setContainers((prev) =>
            append
              ? [
                  ...prev,
                  ...newContainers.filter(
                    (newContainer) =>
                      !prev.some(
                        (prevComment) => prevComment.id === newContainer.id,
                      ),
                  ),
                ]
              : newContainers,
          );
        });
    },
    [search, type, status, machineType, user?.uid, user?.isAdmin],
  );

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setContainers([]);
    fetchContainers();

    return () => subscriptionRef.current?.unsubscribe();
  }, [fetchContainers]);

  const loadMore = () => {
    if (!isLastPage) fetchContainers(true, lastDoc);
  };

  return (
    <div className="containers-list">
      <Stack direction="horizontal" className="containers-sort">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Search..."
            onChange={(e) => searchSubject.next(e.target.value)}
          />
        </InputGroup>
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
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {status && (
        <div className="text-muted">
          {containers.length === 0
            ? `No containers found with status: ${status}`
            : `Showing containers with status: ${status}`}
        </div>
      )}

      {containers.map((comment) => (
        <ContainerData key={comment.id} container={comment} path={path} />
      ))}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button onClick={loadMore} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
