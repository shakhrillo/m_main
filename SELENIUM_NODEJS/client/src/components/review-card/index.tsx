import StarRating from "../star-rating"

interface Review {
  user: {
    name: string
    href: string
    info: string[]
  }
  imageUrls: string[]
  rating: string
  date: string
  review: string
  response: string
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="review-card">
    <h3>
      <a href={review.user.href} target="_blank">
        {review.user.name || "Anonymous"}
      </a>{" "}
      <StarRating rating={review.rating} />
    </h3>
    <div className="review-card__info">
      <small>
        {review.date} {review.imageUrls.length} images
      </small>
    </div>
    <p>{review.review || "No review"}</p>
    <hr />
    <p>
      <strong>Response: </strong>
    </p>
    <p>{review.response || "No response"}</p>
  </div>
)
