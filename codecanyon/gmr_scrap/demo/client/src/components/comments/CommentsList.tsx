import { Table } from "react-bootstrap";
import { CommentImages } from "../CommentImages";
import { CommentQAView } from "../CommentQAView";
import { CommentResponseView } from "../CommentResponseView";
import { CommentVideos } from "../CommentVideos";
import { CommentUser } from "./CommentUser";
import { Ratings } from "../Ratings";
import { useEffect, useState } from "react";
import { IComment, scrapData } from "../../services/scrapService";

export const CommentsList = ({
  reviewId,
  uid,
  filterOptions,
  search,
}: {
  reviewId: string;
  uid: string;
  filterOptions: {
    onlyImages: boolean;
    onlyVideos: boolean;
    onlyQA: boolean;
    onlyResponse: boolean;
  };
  search: string;
}) => {
  const [comments, setComments] = useState([] as IComment[]);

  useEffect(() => {
    const subscription = scrapData(
      reviewId,
      uid,
      filterOptions,
      search,
    ).subscribe((data) => {
      console.log("comments", data);
      setComments(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, uid]);

  return (
    <div className="comments">
      {comments.map((review, index) => (
        <div className="comment" key={`comment-${index}`}>
          <Ratings container={review} />
          <h5>{review.user.url}</h5>
          <CommentUser comment={review} />
          <CommentQAView comment={review} />
          <CommentImages comment={review} />
          <CommentVideos comment={review} />
          <hr />
          <CommentResponseView comment={review} />
        </div>
      ))}
    </div>
  );
};
