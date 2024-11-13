import ReviewComments from "../../components/review-comments"
import ReviewInfo from "../../components/review-info"

function SingleReview() {
  return (
    <div>
      <h3>Single Review</h3>
      <div className="card">
        <ReviewInfo />
        <ReviewComments />
      </div>
    </div>
  )
}

export default SingleReview
