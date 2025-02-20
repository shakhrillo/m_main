import { useEffect, useRef, useState } from "react";
import {
  IconReload,
  IconSearch,
} from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import {
  Alert,
  Button,
  Dropdown,
  Form,
  InputGroup,
  Stack,
} from "react-bootstrap";
import { debounceTime, filter, Subject, take } from "rxjs";
import { reviewComments } from "../../services/reviewService";
import { IComment } from "../../services/scrapService";
import { Comment } from "./Comment";

interface ICommentsListProps {
  reviewId: string;
}

const FILTER_OPTIONS = [{
  key: "",
  label: "All",
}, {
  key: "imageUrls",
  label: "Images",
}, {
  key: "videoUrls",
  label: "Videos",
}, {
  key: "qa",
  label: "Q&A",
}, {
  key: "response",
  label: "Response",
}];

export const CommentsList = ({ reviewId }: ICommentsListProps) => {
  const auth = getAuth();
  const commentsRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filterOptions, setFilterOptions] = useState<string>("");

  useEffect(() => {
    const subscription = searchSubject.pipe(debounceTime(300)).subscribe(setSearch);
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchSubject.next(e.target.value);
  };

  const fetchComments = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    reviewComments({ reviewId, uid: auth.currentUser.uid, filterOptions, search }, lastDocument)
      .pipe(filter((snapshot) => snapshot !== null), take(1))
      .subscribe((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return;
        }
        setLastDoc(snapshot.docs.at(-1));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IComment));
        setComments((prev) => (append ? [...prev, ...data] : data));
      });
  };

  useEffect(() => {
    setLastDoc(null);
    setIsLastPage(false);
    setComments([]);

    fetchComments();
  }, [search, filterOptions, reviewId]);

  return (
    <div className="comments" ref={commentsRef}>
      <Stack direction="horizontal">
        <InputGroup className="me-auto">
          <InputGroup.Text>
            <IconSearch />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search..."
            onChange={handleSearch}
          />
        </InputGroup>
        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="secondary">Filter</Dropdown.Toggle>
          <Dropdown.Menu>
            {
              FILTER_OPTIONS.map(({key, label}) => (
                <Dropdown.Item key={key} onClick={() => setFilterOptions(key)}>
                  <Form.Check
                    type="radio"
                    name="filter"
                    label={label}
                    checked={filterOptions === key}
                    onChange={() => {}}
                  />
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {comments.length ? comments.map((review) => <Comment review={review} key={review.id} />) : (
        <Alert className="w-100" variant="info">No comments found</Alert>
      )}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button onClick={() => fetchComments(true, lastDoc)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
