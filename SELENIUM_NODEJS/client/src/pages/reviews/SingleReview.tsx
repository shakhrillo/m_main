import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ReviewCard } from "../../components/review-card"
import ReviewInfo from "../../components/ReviewInfo"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { collection, onSnapshot } from "firebase/firestore"
import { imagesCountRender } from "../../utils/imagesCountRender"
import { reviewTextRender } from "../../utils/reviewTextRender"

function SingleReview() {
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

      console.log(reviewsData)

      setReviews(reviewsData)
      setLoading(false)
      setError(null)
    })

    return unsubscribe
  }, [firestore, user, place])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h2>Single Review</h2>
      <div className="card">
        <ReviewInfo />

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
      </div>
    </div>
  )
}

export default SingleReview
