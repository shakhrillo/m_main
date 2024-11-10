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
    <div>
      <h3>
        {placeInfo.title || "Anonymous"} - {placeInfo.rating}
      </h3>
      <small>
        Created at: <b>{formatTime(placeInfo.createdAt)}</b>
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
      <hr />
    </div>
  )
}

export default ReviewInfo
