import ReviewComments from "../../components/review-comments"
import ReviewInfo from "../../components/review-info"

function SingleReview() {
  return (
    <div>
      {/* <h3>Single Review</h3> */}
      <ReviewInfo />
      <br />
      <div className="card">
        <div className="card-body">
          <ReviewComments />
        </div>
      </div>
    </div>
  )
}

export default SingleReview
