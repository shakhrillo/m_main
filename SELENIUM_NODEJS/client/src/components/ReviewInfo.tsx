import { doc, onSnapshot, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"

function ReviewInfo() {
  let { place } = useParams()
  const [placeInfo, setPlaceInfo] = useState({} as any)

  const { firestore, user } = useFirebase()

  useEffect(() => {
    if (!firestore || !place || !user) return

    const collectionReviewInfo = doc(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
    )

    const unsubscribe = onSnapshot(collectionReviewInfo, doc => {
      if (doc.exists()) {
        setPlaceInfo({
          ...doc.data(),
          id: doc.id,
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [firestore, user, place])

  function renderCount(review: any) {
    if (!review || !review.extractedReviews)
      return <i className="bi-question-lg"></i>
    let count = review.extractedReviews || 0
    if (!count) {
      count = review.totalReviews
    }
    return <span>{count} - reviews</span>
  }

  function formatTime(date: Timestamp) {
    if (!date || !date.seconds) return ""

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

  function spentTime(start: Timestamp, end: Timestamp) {
    if (!start || !end) return ""

    const diff = end.seconds - start.seconds
    if (diff < 60) {
      return `${diff} seconds`
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes`
    } else {
      return `${Math.floor(diff / 3600)} hours`
    }
  }

  function downloadFile(fileUrl: string) {}

  function deleteReview(id: string) {}

  return (
    <div className="review-info">
      <div className="review-info__header">
        <h5 className="review-info__header__title">
          <i className="bi bi-geo"></i>
          {/* <span
            className={`review-info__header__title__status review-info__header__title__status--${placeInfo.status}`}
          >
            {renderStatus(placeInfo.status)}
          </span> */}
          {placeInfo.title}
        </h5>
        <div className="review-info__header__details">
          <span className={`geo-badge geo-badge--${placeInfo.status}`}>
            {placeInfo.status === "completed"
              ? "Done"
              : placeInfo.status === "failed"
                ? "Canceled"
                : "In proggress"}
          </span>
          <a
            href={placeInfo.url}
            className="btn geo-btn-transparent geo-btn-outline"
          >
            <i className="bi bi-google"></i>
            Open in Google Maps
          </a>
        </div>
      </div>
      <div className="review-info__description">
        <div className="review-info__description__item">
          <i className="bi bi-play-circle-fill"></i>
          {formatTime(placeInfo.createdAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-stop-circle-fill"></i>
          {formatTime(placeInfo.completedAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-hourglass-split"></i>
          {spentTime(placeInfo.createdAt, placeInfo.completedAt)}
        </div>
        <div className="review-info__description__item">
          <i className="bi bi-chat-square-text-fill"></i>
          {renderCount(placeInfo)}
        </div>
      </div>
    </div>
  )
}

export default ReviewInfo
