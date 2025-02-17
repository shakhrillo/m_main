import { Table } from "react-bootstrap";
import { IComment } from "../../services/scrapService";
import { Ratings } from "../Ratings";

export const CommentQA = ({ comment }: { comment?: IComment }) => {
  const isRate = (question: string) => /^[1-9]$|^5$/.test(question);

  return (
    !!comment?.qa?.length && (
      <div className="comment-qa">
        <Table>
          <tbody>
            {comment?.qa.map((qa, index) => (
              <tr key={"qa-" + index}>
                <td>{qa.question}</td>
                <td>
                  {/* TODO: Add ratings */}
                  {/* {isRate(qa.answer) ? (
                    <Ratings container={{ rating: Number(qa.answer) }} />
                  ) : (
                    qa.answer
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  );
};
