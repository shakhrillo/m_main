import { IComment } from "../../services/scrapService";

/**
 * Component to display the review of a comment
 * @param comment The comment to display
 * @returns The review of the comment
 */
export const CommentReview = ({ comment }: { comment?: IComment }) => {
  return <div className="comment-review">{comment?.review}</div>;
};
