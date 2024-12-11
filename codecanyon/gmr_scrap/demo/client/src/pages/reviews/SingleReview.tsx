import ReviewComments from "../../components/review-comments"
import ReviewImages from "../../components/review-images"
import ReviewInfo from "../../components/review-info"

function SingleReview() {
  return (
    <div className="my-5">
      <ReviewInfo />
      <div className="card mt-5">
        <div className="card-body">
          <ReviewImages />
          <ReviewComments />
        </div>
      </div>
    </div>
  )
}

export default SingleReview
