import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import StarRating from "../star-rating"
import dwonloadIcon from "../../assets/icons/download.svg"

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
    <div className="d-flex">
      <div className="w-100 d-flex-column">
        <h3 className="my-0">{placeInfo.title || "Anonymous"}</h3>
        <p>{placeInfo.address}</p>
        <div className="d-flex gap-3 mb-3">
          <button
            onClick={() => window.open(placeInfo.csvUrl, "_blank")}
            disabled={!placeInfo.csvUrl}
            className="button button-lg button-primary"
          >
            <img src={dwonloadIcon} alt="Download CSV" />
            CSV
          </button>
          <button
            onClick={() => window.open(placeInfo.jsonUrl, "_blank")}
            disabled={!placeInfo.jsonUrl}
            className="button button-lg"
          >
            <img src={dwonloadIcon} alt="Download JSON" />
            JSON
          </button>
        </div>
        <div className="card">
          <div className="card-body p-0">
            <ul className="list-unstyled m-0 p-0 d-flex">
              <li className="d-flex-column align-items-center justify-space-around p-5">
                {statusRender(placeInfo.status, { width: 40, height: 40 })}
                <p className="text-capitalize m-0">{placeInfo.status}</p>
              </li>
              <li className="d-flex-column align-items-center justify-space-around p-5 border-left border-right">
                <h2 className="my-0">{placeInfo.totalReviews || 0}</h2>
                <p className="m-0">Extracted reviews</p>
              </li>
              <li className="d-flex-column align-items-center justify-space-around p-5">
                <h2 className="my-0">{spentTime(placeInfo)}</h2>
                <p className="m-0">Spent time</p>
              </li>
            </ul>
          </div>
          <div className="card-footer">
            <StarRating rating={placeInfo.rating} />
            <strong>{placeInfo.rating ? placeInfo.rating : "N/A"}</strong>
            <small>Average user rating</small>
          </div>
        </div>
      </div>
      {placeInfo.screenshot && (
        <div className="w-100">
          <a
            href={placeInfo.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <div
              className="img-glass-left"
              style={{ backgroundImage: `url(${placeInfo.screenshot})` }}
            ></div>
          </a>
        </div>
      )}
    </div>
  )
}

export default ReviewInfo
