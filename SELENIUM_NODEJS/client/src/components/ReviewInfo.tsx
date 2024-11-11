import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import { spentTime } from "../utils/spentTime"
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
    <>
      <div className="review-info">
        <div className="review-info__content">
          {/* <StarRating rating={placeInfo.rating} /> */}
          <h1>{placeInfo.title || "Anonymous"}</h1>
          <p>{placeInfo.address}</p>
          <div className="review-info__actions">
            <button>Download CSV</button>
            <button>Download JSON</button>
          </div>
          <ul className="review-info__status">
            <li>
              <h4>~{placeInfo.totalReviews}</h4>
              <p>Extracted reviews</p>
            </li>
            <li>
              <h4>{spentTime(placeInfo.createdAt, placeInfo.completedAt)}</h4>
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
    </>
  )
}

export default ReviewInfo
