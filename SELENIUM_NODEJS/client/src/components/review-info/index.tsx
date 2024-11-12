import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import StarRating from "../star-rating"

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
    <div className="d-flex mb-5">
      <div className="d-flex-column">
        <h1 className="my-0">{placeInfo.title || "Anonymous"}</h1>
        <p>{placeInfo.address}</p>
        <div className="d-flex gap-3 mt-auto">
          <button
            onClick={() => window.open(placeInfo.csvUrl, "_blank")}
            disabled={!placeInfo.csvUrl}
            className="button button-lg button-primary"
          >
            Download CSV
          </button>
          <button
            onClick={() => window.open(placeInfo.jsonUrl, "_blank")}
            disabled={!placeInfo.jsonUrl}
            className="button button-lg"
          >
            Download JSON
          </button>
        </div>
        <ul className="list-unstyled d-flex gap-2 mb-0 mt-3 border-bottom border-top">
          <li className="d-flex-column gap-1 align-items-center justify-space-around p-5">
            {statusRender(placeInfo.status, { width: 40, height: 40 })}
            <p className="text-capitalize m-0">{placeInfo.status}</p>
          </li>
          <li className="d-flex-column gap-1 align-items-center justify-space-around p-5 border-left border-right">
            <h2 className="my-0">{placeInfo.totalReviews || 0}</h2>
            <p className="m-0">Extracted reviews</p>
          </li>
          <li className="d-flex-column gap-1 align-items-center justify-space-around p-5">
            <h2 className="my-0">{spentTime(placeInfo)}</h2>
            <p className="m-0">Spent time</p>
          </li>
        </ul>
        <div className="d-flex gap-3 align-items-center py-3">
          <StarRating rating={placeInfo.rating} />
          <strong>{placeInfo.rating ? placeInfo.rating : "N/A"}</strong>
          <small>Average user rating</small>
        </div>
      </div>
      {placeInfo.screenshot && (
        <a href={placeInfo.url} target="_blank" rel="noreferrer">
          <div className="img-glass-left">
            <img src={placeInfo.screenshot} alt="" />
          </div>
        </a>
      )}
    </div>
  )
}

export default ReviewInfo
