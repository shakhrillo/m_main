import { doc, onSnapshot, Timestamp } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import { spentTime } from "../utils/spentTime"
import { formatTimestamp } from "../utils/formatTimestamp"

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
    <div className="review-info">
      <div>
        <h3>
          {placeInfo.title || "Anonymous"} - {placeInfo.rating}
        </h3>
        <p>{placeInfo.reviews}</p>
        <p>{placeInfo.address}</p>
        <p>{placeInfo.phone}</p>
        <p>{placeInfo.website}</p>
        <small>
          Created at: <b>{formatTimestamp(placeInfo.createdAt)}</b>
        </small>
        <p>{placeInfo.reviews || "No review"}</p>
        <p>{placeInfo.address}</p>
        <p>
          <a href={placeInfo.website} target="_blank" rel="noreferrer">
            {placeInfo.website}
          </a>
        </p>
        <p>
          Spent time: {spentTime(placeInfo.createdAt, placeInfo.completedAt)}{" "}
          (Machine running time)
        </p>
        <p>
          Extracted reviews: {placeInfo.totalReviews} (Sorted by:{" "}
          {placeInfo.sortBy})
        </p>
      </div>
      <div className="map">
        <iframe
          ref={iframeRef}
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6114.090885115666!2d-76.7424803!3d39.9850898!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c88e82766be9b3%3A0x4d585143ce8a9011!2sWingate%20by%20Wyndham%20York!5e0!3m2!1sen!2s!4v1731286254590!5m2!1sen!2s&&zoomControl=false"
          width="600"
          height="450"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  )
}

export default ReviewInfo
