import { IComment } from "../../types/comment";

interface ICommentResponse {
  comment?: IComment;
}

/**
 * Component to display the response of a comment
 * @param comment The comment to display
 * @returns The response of the comment
 */
export const CommentResponse = ({ comment }: ICommentResponse) => {
  return (
    comment?.response && (
      <div className="comment-response">{comment?.response}</div>
    )
  );
};
