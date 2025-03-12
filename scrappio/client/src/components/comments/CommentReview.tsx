import type { IComment } from "../../types/comment";

interface ICommentReview {
  comment?: IComment;
}

/**
 * Component to display the review of a comment
 * @param comment The comment to display
 * @returns The review of the comment
 */
export const CommentReview = ({ comment }: ICommentReview) => {
  return <div className="comment-review">{comment?.review || ""}</div>;
};
