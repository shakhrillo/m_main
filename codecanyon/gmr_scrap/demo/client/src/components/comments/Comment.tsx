import {
  IconArrowNarrowDownDashed,
  IconArrowUp,
  IconCaretDown,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Ratings } from "../Ratings";
import { CommentImages } from "./CommentImages";
import { CommentQA } from "./CommentQA";
import { CommentResponse } from "./CommentResponse";
import { CommentReview } from "./CommentReview";
import { CommentVideos } from "./CommentVideos";
import { IComment } from "../../types/comment";
import { maskName } from "../../utils/maskName";

export const Comment = ({ comment }: { comment: IComment }) => {
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
        <img src={comment?.user?.image} alt={comment?.user?.name} />
        <div className="comment-user-info">
          <strong>{maskName(comment?.user?.name)}</strong>
          <Ratings container={comment} />
        </div>
        <div className="comment-time">{comment?.date}</div>
      </div>
      <CommentReview comment={comment} />
      <CommentQA comment={comment} />
      <CommentImages comment={comment} />
      <CommentVideos comment={comment} />
      <CommentResponse comment={comment} />
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
