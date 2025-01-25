import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Dropdown, Form, InputGroup, Stack } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { debounceTime, Subject } from "rxjs";
import { IComment, scrapData } from "../../services/scrapService";
import { Comment } from "./Comment";
import { reviews } from "../../services/reviewsService";

interface ICommentsListProps {
  reviewId: string;
}

export const CommentsList = ({ reviewId }: ICommentsListProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { uid } = useOutletContext<User>();
  const [comments, setComments] = useState([] as IComment[]);
  const [filterOptions, setFilterOptions] = useState({
    onlyImages: false,
    onlyVideos: false,
    onlyQA: false,
    onlyResponse: false,
  });
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());

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
    const subscription = reviews(
      reviewId,
      uid,
      filterOptions,
      search,
    ).subscribe((data) => {
      console.log("))", data);
      setComments(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, uid]);

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
      {comments.map((review, index) => (
        <Comment review={review} key={index} />
      ))}
    </div>
  );
};
