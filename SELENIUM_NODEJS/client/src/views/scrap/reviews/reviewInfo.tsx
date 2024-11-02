import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../../contexts/FirebaseProvider";

function ReviewInfo() {
  let { place } = useParams();
  const [placeInfo, setPlaceInfo] = useState({} as any);

  const { firestore, user } = useFirebase();

  useEffect(() => {
    if (!firestore || !place || !user) return

    const collectionReviewInfo = doc(firestore, "users", user.uid, "reviews", place)

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
    if (!review || !review.extractedReviews) return <i className="bi-question-lg"></i>
    let count = review.extractedReviews || 0;
    if (!count) {
      count = review.totalReviews;
    }

    return <span>{count} reviews</span>
  }

  function renderStatus(status: string) {
    switch (status) {
      case "completed":
        return <i className="bi-check-lg"></i>
      case "failed":
        return <i className="bi-x-lg"></i>
      case "in-progress":
        return <i className="bi-arrow-repeat"></i>
      default:
        return <i className="bi-question-lg"></i>
    }
  }

  function formatTime(date: Timestamp) {
    if (!date || !date.seconds) return "";

    const d = new Date(date.seconds * 1000)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  }

  function spentTime(start: Timestamp, end: Timestamp) {
    if (!start || !end) return "";

    const diff = end.seconds - start.seconds;
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
    <div className="card">
      <div className="card-body">
        <h5 className="card-title d-flex gap-2">
          <span className={`text-${placeInfo.status === "completed" ? "success" : "danger"}`}>
            {renderStatus(placeInfo.status)}
          </span>
          {placeInfo.title}
        </h5>
        <a href={placeInfo.url} target="_blank" className="btn btn-primary">
          Open in Google Maps
        </a>
        <hr />
        <p className="card-text">
          <span className="fw-bold">Extracted reviews:</span> {renderCount(placeInfo)}  
        </p>
        <p className="card-text">
          <span className="fw-bold">Start time:</span> {formatTime(placeInfo.createdAt)}
        </p>
        <p className="card-text">
          <span className="fw-bold">End time:</span> {formatTime(placeInfo.completedAt)}
        </p>
        <p className="card-text">
          <span className="fw-bold">Spent time:</span> {spentTime(placeInfo.createdAt, placeInfo.completedAt)}
        </p>
      </div>
    </div>
  );
}

export default ReviewInfo;