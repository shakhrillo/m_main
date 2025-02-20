import { useEffect, useRef, useState } from "react";
import { IconFilter, IconReload, IconSearch } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { Alert, Button, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import { debounceTime, filter, Subject, take } from "rxjs";
import { reviewComments } from "../../services/reviewService";
import { IComment } from "../../services/scrapService";
import { Comment } from "./Comment";

interface ICommentsListProps {
  reviewId: string;
}

const FILTER_OPTIONS = [
  { key: "", label: "All" },
  { key: "imageUrls", label: "Images" },
  { key: "videoUrls", label: "Videos" },
  { key: "qa", label: "Q&A" },
  { key: "response", label: "Response" },
];

/**
 * CommentsList component
 * @param reviewId Review ID
 * @returns JSX.Element
 */
export const CommentsList = ({ reviewId }: ICommentsListProps) => {
  const auth = getAuth();
  const commentsRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filterOptions, setFilterOptions] = useState("");

  useEffect(() => {
    const subscription = searchSubject.pipe(debounceTime(300)).subscribe(setSearch);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setComments([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchComments();
  }, [search, filterOptions, reviewId]);

  const fetchComments = (append = false, lastDocument = null) => {
    if (!auth.currentUser?.uid) return;

    reviewComments({ reviewId, uid: auth.currentUser.uid, filterOptions, search }, lastDocument).pipe(filter((snapshot) => snapshot !== null), take(1)).subscribe((snapshot) => {
      if (snapshot.empty) {
        setIsLastPage(true);
        return;
      }
      setLastDoc(snapshot.docs.at(-1));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IComment));
      setComments((prev) => (append ? [...prev, ...data] : data));
    });
  };

  return (
    <div className="comments" ref={commentsRef}>
      <Stack direction="horizontal" className="bg-light p-3 rounded">
        <div className="me-auto">
          <InputGroup>
            <Form.Control type="search" placeholder="Search..." onChange={(e) => searchSubject.next(e.target.value)} />
          </InputGroup>
        </div>
        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-filter">
            <IconFilter className="me-2" />
            Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {FILTER_OPTIONS.map(({ key, label }) => (
              <Dropdown.Item key={key} onClick={() => setFilterOptions(key)}>
                <Form.Check type="radio" name="filter" label={label} checked={filterOptions === key} readOnly />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {comments.length > 0 ? (
        comments.map((review) => <Comment review={review} key={review.id} />)
      ) : (
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
