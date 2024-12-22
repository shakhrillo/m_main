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
    <div className="row row-cols-6 g-2">
      {reviewImgs.map((img, index) => (
        <div className="col" key={index}>
          <a
            className={`${img.videoUrl ? "video-wrapper" : "img-wrapper"}`}
            href={img.videoUrl || img.thumb}
            target="_blank"
            rel="noreferrer"
          >
            <img src={img.thumb} alt={`Review ${index}`} />
          </a>
        </div>
      ))}
    </div>
  )
}

export default ReviewImages
