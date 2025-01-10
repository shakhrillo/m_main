import ReviewComments from "../components/review-comments";
import ReviewInfo from "../components/review-info";

function SingleReview() {
  return (
    <div className="container-fluid">
      <div className="row row-cols-1 g-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <ReviewInfo />
            </div>
          </div>
        </div>
        <div className="col">
          <ReviewComments />
        </div>
      </div>
    </div>
  );
}

export default SingleReview;
