import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import { spentTime } from "../utils/spentTime"
import { statusRender } from "../utils/statusRender"
import StarRating from "./star-rating"

function ReviewInfo() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [placeInfo, setPlaceInfo] = useState<any>({})

  useEffect(() => {
    if (!firestore || !place || !user) return
    const reviewInfoDoc = doc(firestore, "users", user.uid, "reviews", place)

    const unsubscribe = onSnapshot(reviewInfoDoc, doc => {
      if (doc.exists()) {
        setPlaceInfo({ ...doc.data(), id: doc.id })
      }
    })

    return () => unsubscribe()
  }, [firestore, user, place])

  return (
    <div className="review-info">
      <div className="review-info__content">
        <h1>{placeInfo.title || "Anonymous"}</h1>
        <p>{placeInfo.address}</p>
        <div className="review-info__actions">
          <button
            onClick={() => window.open(placeInfo.csvUrl, "_blank")}
            disabled={!placeInfo.csvUrl}
            className="primary"
          >
            Download CSV
          </button>
          <button
            onClick={() => window.open(placeInfo.jsonUrl, "_blank")}
            disabled={!placeInfo.jsonUrl}
          >
            Download JSON
          </button>
        </div>
        <ul className="review-info__status">
          <li>{statusRender(placeInfo.status)}</li>
          <li>
            <h4>{placeInfo.totalReviews || 0}</h4>
            <p>Extracted reviews</p>
          </li>
          <li>
            <h4>{spentTime(placeInfo)}</h4>
            <p>Spent time</p>
          </li>
        </ul>
        <div className="review-info__rate">
          <StarRating rating={placeInfo.rating} />
          <strong>{placeInfo.rating ? placeInfo.rating : "N/A"}</strong>
          <small>Average user rating</small>
        </div>
      </div>
      <a
        href={placeInfo.url}
        className="review-info__screenshot"
        style={{ backgroundImage: `url(${placeInfo.screenshot})` }}
        target="_blank"
        rel="noreferrer"
      ></a>
    </div>
  )
}

export default ReviewInfo
