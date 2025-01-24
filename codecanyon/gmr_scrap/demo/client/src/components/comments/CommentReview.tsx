import { useState } from "react";
import { Button } from "react-bootstrap";
import { IComment } from "../../services/scrapService";

/**
 * Component to display the review of a comment
 * @param comment The comment to display
 * @returns The review of the comment
 */
export const CommentReview = ({ comment }: { comment?: IComment }) => {
  const [textLimit, setTextLimit] = useState(150);
  const isTruncated = comment?.review && comment?.review?.length > textLimit;

  const expand = () => {
    setTextLimit(Infinity);
  };

  return (
    <div className="comment-review">
      {isTruncated ? (
        <>
          {comment.review.slice(0, textLimit)}...
          <Button size="sm" variant="outline-primary" onClick={expand}>
            Read more ({comment.review.length - textLimit} text)
          </Button>
        </>
      ) : (
        comment?.review
      )}
    </div>
  );
};
