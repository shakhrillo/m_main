import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";
import { getAuth, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Card,
  CardBody,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Stack,
} from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { debounceTime, Subject } from "rxjs";
import { reviewComments } from "../../services/reviewService";
import { IComment } from "../../services/scrapService";
import { Comment } from "./Comment";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

interface ICommentsListProps {
  reviewId: string;
}

export const CommentsList = ({ reviewId }: ICommentsListProps) => {
  const auth = getAuth();
  const commentsRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState([] as IComment[]);
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    onlyImages: false,
    onlyVideos: false,
    onlyQA: false,
    onlyResponse: false,
  });
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());
  const [paginationLength, setPaginationLength] = useState(5);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updatePagination = () => {
      if (paginationRef.current) {
        const width = paginationRef.current.clientWidth;
        setPaginationLength(Math.floor(width / 100) - 2);
      }
    };

    updatePagination();
    window.addEventListener("resize", updatePagination);

    return () => {
      window.removeEventListener("resize", updatePagination);
    };
  }, []);

  useEffect(() => {
    const subscription = searchSubject
      .pipe(debounceTime(300))
      .subscribe((value) => {
        setSearch(value);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    
    console.log('auth.currentUser?.uid', auth.currentUser?.uid);
    setPage(1);
    const subscription = reviewComments(
      reviewId,
      auth.currentUser?.uid || "",
      filterOptions,
      search,
    ).subscribe((data) => {
      console.log('->', data);
      setComments(data);
      setTotal(Math.ceil(data.length / limit));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, auth.currentUser?.uid]);

  return (
    <div className="comments" ref={commentsRef}>
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
              onChange={(e) => {
                searchSubject.next(e.target.value);
              }}
            />
          </InputGroup>
        </div>
        <Dropdown autoClose="outside">
          <Dropdown.Toggle id="dropdown-filter" variant="secondary">
            Filter
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                setFilterOptions({
                  ...filterOptions,
                  onlyImages: !filterOptions.onlyImages,
                });
              }}
            >
              <Form>
                <Form.Check
                  type="checkbox"
                  id="filter-image-checkbox"
                  label="Image comments"
                  checked={filterOptions.onlyImages}
                />
              </Form>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                setFilterOptions({
                  ...filterOptions,
                  onlyVideos: !filterOptions.onlyVideos,
                });
              }}
            >
              <Form>
                <Form.Check
                  type="checkbox"
                  id="filter-video-checkbox"
                  label="Video comments"
                  checked={filterOptions.onlyVideos}
                />
              </Form>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                setFilterOptions({
                  ...filterOptions,
                  onlyQA: !filterOptions.onlyQA,
                });
              }}
            >
              <Form>
                <Form.Check
                  type="checkbox"
                  id="filter-qa-checkbox"
                  label="QA comments"
                  checked={filterOptions.onlyQA}
                />
              </Form>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                setFilterOptions({
                  ...filterOptions,
                  onlyResponse: !filterOptions.onlyResponse,
                });
              }}
            >
              <Form>
                <Form.Check
                  type="checkbox"
                  id="filter-response-checkbox"
                  label="Response comments"
                  checked={filterOptions.onlyResponse}
                />
              </Form>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
      {comments.slice((page - 1) * limit, page * limit).map((review, index) => (
        <Comment review={review} key={index} />
      ))}

      {comments.length > limit && (
        <Card>
          <CardBody
            ref={paginationRef}
            className="d-flex justify-content-center w-100"
          >
            <Pagination className="m-0">
              <Pagination.Prev
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              />

              {page > Math.floor(paginationLength / 2) + 1 && (
                <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>
              )}

              {page > Math.floor(paginationLength / 2) + 1 && (
                <Pagination.Ellipsis />
              )}

              {Array.from({ length: paginationLength })
                .map((_, index) => {
                  const start = Math.max(
                    1,
                    Math.min(
                      page - Math.floor(paginationLength / 2),
                      total - paginationLength + 1,
                    ),
                  );
                  return start + index;
                })
                .filter((p) => p >= 1 && p <= total)
                .map((p) => (
                  <Pagination.Item
                    key={p}
                    active={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Item>
                ))}

              {page < total - Math.floor(paginationLength / 2) && (
                <Pagination.Ellipsis />
              )}

              {page < total - Math.floor(paginationLength / 2) && (
                <Pagination.Item onClick={() => setPage(total)}>
                  {total}
                </Pagination.Item>
              )}

              <Pagination.Next
                onClick={() => setPage((prev) => Math.min(prev + 1, total))}
                disabled={page === total}
              />
            </Pagination>
          </CardBody>
        </Card>
      )}

      {!comments.length && (
        <Alert className="w-100" variant="info">
          No comments found
        </Alert>
      )}
    </div>
  );
};
