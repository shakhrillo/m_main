import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import { spentTime } from "../utils/spentTime"
import StarRating from "./star-rating"
import { statusRender } from "../utils/statusRender"
// import

function ReviewInfo() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [placeInfo, setPlaceInfo] = useState<any>({})

  useEffect(() => {
    if (!firestore || !place || !user) return

    const reviewInfoDoc = doc(firestore, "users", user.uid, "reviews", place)

    const unsubscribe = onSnapshot(reviewInfoDoc, doc => {
      if (doc.exists()) {
        console.log("Document data:", doc.data())
        setPlaceInfo({ ...doc.data(), id: doc.id })
      }
    })

    return () => unsubscribe()
  }, [firestore, user, place])

  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current as any

    if (!iframe) return

    // Ensure the iframe is loaded
    iframe.onload = () => {
      console.log("iframe loaded", iframe.contentWindow.document)
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document

      // Select the button and set display to none
      const button = iframeDocument.querySelector("button")
      if (button) {
        button.style.display = "none"
      }
    }
  }, [])

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
            <h4>~{placeInfo.totalReviews || 0}</h4>
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
        {/* <div className="review-info__chart">
            <DoughnutChart />
          </div> */}
        {/* (Rating: {placeInfo.rating}) */}
        {/* <p>{placeInfo.reviews}</p>
        <p>{placeInfo.address}</p>
        <p>{placeInfo.phone}</p>
        <p>{placeInfo.website}</p> */}
        {/* <hr /> */}
        {/* <p>
          Created at: <b>{formatTimestamp(placeInfo.createdAt)}</b>
        </p> */}
        {/* <p>
          Spent time: {spentTime(placeInfo.createdAt, placeInfo.completedAt)}{" "}
          (Machine running time)
        </p>
        <p>
          Extracted reviews: {placeInfo.totalReviews} (Sorted by:{" "}
          {placeInfo.sortBy})
        </p> */}
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
