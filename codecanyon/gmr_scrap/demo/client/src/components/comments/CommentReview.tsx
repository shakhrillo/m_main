import { IComment } from "../../services/scrapService";

/**
 * Mask the comment by replacing the middle words with *
 * @param comment The comment to mask
 * @returns The masked comment
 */
function maskComment(comment: string): string {
  const words = comment.split(" ");
  const totalWords = words.length;

  if (totalWords <= 10) {
    return comment;
  }

  const visibleCount = Math.min(5, Math.floor(totalWords / 3));
  const firstPart = words.slice(0, visibleCount);
  const maskedMiddle = words.slice(visibleCount, totalWords - visibleCount).map(() => "*");
  const lastPart = words.slice(-visibleCount);

  return [...firstPart, ...maskedMiddle, ...lastPart].join(" ");
}

/**
 * Component to display the review of a comment
 * @param comment The comment to display
 * @returns The review of the comment
 */
export const CommentReview = ({ comment }: { comment?: IComment }) => {
  // make it *** random characters
  return <div className="comment-review">{maskComment(comment?.review || "")}</div>;
};
