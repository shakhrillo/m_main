import {
  IconArrowNarrowDownDashed,
  IconArrowUp,
  IconCaretDown,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { IComment } from "../../services/scrapService";
import { Ratings } from "../Ratings";
import { CommentImages } from "./CommentImages";
import { CommentQA } from "./CommentQA";
import { CommentResponse } from "./CommentResponse";
import { CommentReview } from "./CommentReview";
import { CommentVideos } from "./CommentVideos";

export const Comment = ({ review }: { review: IComment }) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (commentRef.current) {
      const commentHeight = commentRef.current.clientHeight;
      setExpanded(commentHeight <= 200);
    }
  }, []);

  return (
    <div className={`comment ${expanded ? "expanded" : ""}`} ref={commentRef}>
      <div className="comment-user">
        <img src={review.user.image} alt={review.user.name} />
        <div className="comment-user-info">
          <a href={review.user.url} target="_blank" rel="noreferrer">
            {review.user.name}
          </a>
          {/* TODO: Add ratings */}
          {/* <Ratings container={review} /> */}
        </div>
        <small>{review.date}</small>
      </div>
      <CommentReview comment={review} />
      <CommentQA comment={review} />
      <CommentImages comment={review} />
      <CommentVideos comment={review} />
      <CommentResponse comment={review} />
      {!expanded && (
        <div className="comment-expand">
          <Button variant="link" onClick={() => setExpanded(!expanded)}>
            {expanded ? <IconChevronUp /> : <IconChevronDown />}
          </Button>
        </div>
      )}
    </div>
  );
};
