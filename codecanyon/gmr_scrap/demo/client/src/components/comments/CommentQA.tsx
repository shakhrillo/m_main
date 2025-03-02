import type { IComment } from "../../types/comment";
import { Ratings } from "../Ratings";

interface ICommentQA {
  comment?: IComment;
}

/**
 * Comment QA component.
 * @param comment Comment object.
 * @returns Comment QA component.
 */
export const CommentQA = ({ comment }: ICommentQA) => {
  if (!comment?.qa?.length) return null;

  const isRate = (answer: string) => /^[1-9]$|^5$/.test(answer);

  return (
    <>
      {comment.qa.map(({ question, answer }, index) => (
        <div className="comment-qa" key={`qa-${index}`}>
          <strong>{question}</strong>
          {isRate(answer) ? <Ratings container={comment} /> : answer}
        </div>
      ))}
    </>
  );
};
