import { doc, onSnapshot, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"

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

  const renderCount = (review: any) => {
    const count = review?.extractedReviews || review?.totalReviews || 0
    return <span>{count} - reviews</span>
  }

  const formatTime = (date: Timestamp) => {
    if (!date?.seconds) return ""
    const d = new Date(date.seconds * 1000)
    return new Date(`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`)
      .toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", " -")
  }

  const spentTime = (start: Timestamp, end: Timestamp) => {
    if (!start || !end) return ""
    const diff = end.seconds - start.seconds

    if (diff < 60) return `${diff} seconds`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`
    return `${Math.floor(diff / 3600)} hours`
  }

  return (
    <div className="review-info">
      <div className="review-info__header">
        <h5 className="review-info__header__title">
          <i className="bi bi-geo"></i>
          {placeInfo.title}
        </h5>
        <div className="review-info__header__details">
          <span className={`geo-badge geo-badge--${placeInfo.status}`}>
            {placeInfo.status === "completed"
              ? "Done"
              : placeInfo.status === "failed"
                ? "Canceled"
                : "In progress"}
          </span>
          <a
            href={placeInfo.url}
            className="btn geo-btn-transparent geo-btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-google"></i> Open in Google Maps
          </a>
        </div>
      </div>

      <div className="review-info__description">
        <div className="review-info__description__item">
          <i className="bi bi-play-circle-fill"></i>{" "}
          {formatTime(placeInfo.createdAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-stop-circle-fill"></i>{" "}
          {formatTime(placeInfo.completedAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-hourglass-split"></i>{" "}
          {spentTime(placeInfo.createdAt, placeInfo.completedAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-chat-square-text-fill"></i>{" "}
          {renderCount(placeInfo)}
        </div>
      </div>
    </div>
  )
}

export default ReviewInfo
