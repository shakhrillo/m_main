import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { imagesCountRender } from "../../utils/imagesCountRender"
import { reviewTextRender } from "../../utils/reviewTextRender"

function ReviewComments() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore || !place || !user) return

    const reviewsRef = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "reviews",
    )

    const unsubscribe = onSnapshot(reviewsRef, async snapshot => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setReviews(reviewsData)
      setLoading(false)
      setError(null)
    })

    return unsubscribe
  }, [firestore, user, place])

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Rating</th>
          <th>Images</th>
          <th>Review</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review, index) => (
          <tr key={review.id}>
            <td>{index + 1}</td>
            <td>{review.rating}</td>
            <td>{imagesCountRender(review.imageUrls)}</td>
            <td>{reviewTextRender(review.review)}</td>
            <td>{reviewTextRender(review.response)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ReviewComments
