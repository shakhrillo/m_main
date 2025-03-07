import { useEffect, useRef, useState } from "react";
import { IconFilter, IconReload } from "@tabler/icons-react";
import { Button, Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import type { Subscription } from "rxjs";
import { debounceTime, filter, Subject } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import { Comment } from "./Comment";
import type { IUserInfo } from "../../types/userInfo";
import { useOutletContext } from "react-router-dom";
import type { IComment } from "../../types/comment";
import type { IDockerContainer } from "../../types/dockerContainer";

interface ICommentsList {
  container: IDockerContainer;
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
 * Comments list component.
 * @param reviewId Review ID.
 * @param container Docker container object.
 * @returns Comments list component.
 */
export const CommentsList = ({ reviewId, container }: ICommentsList) => {
  const user = useOutletContext<IUserInfo>();
  const commentsRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filterOptions, setFilterOptions] = useState("");
  const subscriptionRef = useRef<Subscription | null>(null);

  const fetchComments = (append = false, lastDocument = null) => {
    if (!user?.uid || isLastPage) return;

    subscriptionRef.current?.unsubscribe();

    const subscription = reviewsData(
      "reviews",
      {
        reviewId,
        uid: !user.isAdmin ? user.uid : undefined,
        filterOptions,
        search,
      },
      lastDocument,
    )
      .pipe(
        filter(
          (snapshot) =>
            snapshot !== null && (snapshot.size !== 0 || !!lastDocument),
        ),
      )
      .subscribe((snapshot) => {
        setIsLastPage(() => snapshot.empty || snapshot.docs.length < 10);

        const newComments = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as IComment),
        );

        setComments((prev) =>
          append ? [...prev, ...newComments] : newComments,
        );
        setLastDoc(snapshot.docs.at(-1));
      });

    subscriptionRef.current = subscription;
  };

  useEffect(() => {
    const subscription = searchSubject
      .pipe(debounceTime(300))
      .subscribe(setSearch);
    return () => subscription.unsubscribe();
  }, [searchSubject]);

  useEffect(() => {
    setComments([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchComments();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [reviewId, user, filterOptions, search]);

  return (
    <div className="comments" ref={commentsRef}>
      <Stack direction="horizontal" className="comments-sort">
        <div className="me-auto">
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search..."
              onChange={(e) => searchSubject.next(e.target.value)}
            />
          </InputGroup>
        </div>

        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="outline-secondary">
            <IconFilter className="me-2" />
            Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {FILTER_OPTIONS.map(({ key, label }) => (
              <Dropdown.Item key={key} onClick={() => setFilterOptions(key)}>
                <Form.Check
                  type="radio"
                  name="filter"
                  label={label}
                  checked={filterOptions === key}
                  readOnly
                />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}

      {!isLastPage &&
        comments.length > 0 &&
        comments.length !== container?.totalReviews && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button
              onClick={() => fetchComments(true, lastDoc)}
              variant="outline-primary"
            >
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )}
    </div>
  );
};
