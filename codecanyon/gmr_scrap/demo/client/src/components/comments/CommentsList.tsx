import { Stack, Table } from "react-bootstrap";
import { CommentImages } from "./CommentImages";
import { CommentResponseView } from "../CommentResponseView";
import { CommentVideos } from "../CommentVideos";
import { CommentReview } from "./CommentReview";
import { Ratings } from "../Ratings";
import { useEffect, useState } from "react";
import { IComment, scrapData } from "../../services/scrapService";
import { CommentQA } from "./CommentQA";

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
          <div className="comment-user">
            <img src={review.user.image} alt={review.user.name} />
            <div className="comment-user-info">
              <a href={review.user.url} target="_blank" rel="noreferrer">
                {review.user.name}
              </a>
              <Ratings container={review} />
            </div>
            <span>{review.date}</span>
          </div>
          <CommentReview comment={review} />
          <CommentQA comment={review} />
          <CommentImages comment={review} />
          <CommentVideos comment={review} />
          <hr />
          <CommentResponseView comment={review} />
        </div>
      ))}
    </div>
  );
};
