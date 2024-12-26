import ReviewComments from "../../components/review-comments"
import ReviewImages from "../../components/review-images"
import ReviewInfo from "../../components/review-info"

function SingleReview() {
  return (
    <div className="container-fluid">
      <div className="row g-2">
        <div className="col-12">
          <ReviewInfo />
        </div>
        <div className="col-12">
          <ReviewComments />
        </div>
      </div>
    </div>
  )
}

export default SingleReview
