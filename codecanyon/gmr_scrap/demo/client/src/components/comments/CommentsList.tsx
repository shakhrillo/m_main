import {
  IconReload,
  IconSearch,
} from "@tabler/icons-react";
import { getAuth, User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Stack,
} from "react-bootstrap";
import { debounceTime, filter, map, Subject, take } from "rxjs";
import { reviewComments } from "../../services/reviewService";
import { IComment } from "../../services/scrapService";
import { Comment } from "./Comment";

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

  const fetchComments = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    return reviewComments({
      reviewId,
      uid: auth.currentUser?.uid || "",
      filterOptions,
      search,
    }, lastDocument).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return [];
        }
        setLastDoc(snapshot.docs.at(-1));
        return snapshot.docs.map((doc) => {
          const data = doc.data() as IComment;
          return { ...data, id: doc.id };
        });
      }),
      take(1),
    ).subscribe((data) => {
      setComments((prev) => (append ? [...prev, ...data] : data));
    });
  }

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setComments([]);
    const subscription = fetchComments();
    return () => subscription?.unsubscribe();
  }, [search, filterOptions, reviewId]);

  const loadMore = () => {
    if (!isLastPage) fetchComments(true, lastDoc);
  };

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
              onChange={handleSearch}
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
      {comments.map((review, index) => (
        <Comment review={review} key={index} />
      ))}

      {!comments.length && (
        <Alert className="w-100" variant="info">
          No comments found
        </Alert>
      )}

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
