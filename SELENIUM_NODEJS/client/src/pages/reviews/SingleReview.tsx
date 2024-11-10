import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ReviewCard } from "../../components/review-card"
import ReviewInfo from "../../components/ReviewInfo"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { fetchReviews } from "../../services/firebaseService"

function SingleReview() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore || !place || !user) return

    const fetchReviewData = async () => {
      try {
        setLoading(true)
        const reviewsData = await fetchReviews(user.uid, place)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setError("Failed to load reviews.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviewData()
  }, [firestore, user, place])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h2>Single Review</h2>
      <div className="card">
        <ReviewInfo />
        <br />

        {reviews.map(review => (
          <ReviewCard review={review} key={review.id} />
        ))}
      </div>
    </div>
  )
}

export default SingleReview
