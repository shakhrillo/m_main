interface Review {
  user: {
    name: string
    info: string[]
  }
  imageUrls: string[]
  rating: string
  date: string
  review: string
  response: string
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <>
    <h3>
      {review.user.name || "Anonymous"} - {review.rating}
    </h3>
    <small>
      Created at: <b>{review.date}</b>
    </small>
    <p>{review.review || "No review"}</p>
    <p>
      <strong>Images: {review.imageUrls.length}</strong>
    </p>
    <div>
      {review.imageUrls.map(url => (
        <img src={url} alt="Review" key={url} width="100" height="100" />
      ))}
    </div>
    <p>
      <strong>Response: </strong>
    </p>
    <p>{review.response || "No response"}</p>
    <hr />
  </>
)
