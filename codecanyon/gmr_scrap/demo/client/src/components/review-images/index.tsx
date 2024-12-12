import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"

function ReviewImages() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [reviewImgs, setReviewImgs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore || !place || !user) return

    const reviewsImgRef = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "images",
    )

    const q = query(reviewsImgRef)
    // const q = query(reviewsImgRef, orderBy("time", "asc"))

    const unsubscribe = onSnapshot(q, async snapshot => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setReviewImgs(reviewsData)
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
    <div className="row">
      <div className="col-12 text-center">
        <h3>Images ({reviewImgs.length})</h3>
      </div>
      {reviewImgs.map((img, index) => (
        <a
          className="col-sm-12 col-md-6 col-lg-2 mb-3"
          key={index}
          href={img.videoUrl || img.thumb}
          target="_blank"
          rel="noreferrer"
        >
          <img src={img.thumb} className="img-fluid" alt={`Review ${index}`} />
        </a>
      ))}
    </div>
  )
}

export default ReviewImages
