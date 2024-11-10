import { onSnapshot, Timestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import ReviewsCard from "../../components/reviews-card"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"

// Utility functions
const renderReviewCount = (review: any) => (
  <span>
    {review?.totalReviews || <i className="bi-question-lg"></i>} reviews
  </span>
)

const formatTimestamp = (timestamp: Timestamp) =>
  timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : ""

const calculateElapsedTime = (start: Timestamp, end: Timestamp) => {
  const diffInSeconds = (end?.seconds || 0) - (start?.seconds || 0)
  return diffInSeconds < 60
    ? `${diffInSeconds} seconds`
    : diffInSeconds < 3600
      ? `${Math.floor(diffInSeconds / 60)} minutes`
      : `${Math.floor(diffInSeconds / 3600)} hours`
}

// Table configuration for Review Cards
const tableColumns = [
  {
    textRender: () => <input type="checkbox" />,
    field: "index",
    render: (_: any, index: number) => <input type="checkbox" />,
  },
  {
    text: "Place",
    field: "title",
    render: (row: any) => (
      <a href={`/reviews/${row.id}`}>{row.title || row.url}</a>
    ),
    icon: "map",
  },
  {
    text: "Date",
    field: "createdAt",
    render: (row: any) => <span>{formatTimestamp(row.createdAt)}</span>,
    icon: "calendar",
  },
  {
    text: "Reviews",
    field: "totalReviews",
    render: renderReviewCount,
    icon: "list",
  },
  {
    text: "Time",
    field: "timeSpent",
    render: (row: any) => calculateElapsedTime(row.createdAt, row.completedAt),
    icon: "clock",
  },
  {
    text: "File Format",
    field: "format",
    render: () => (
      <select>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>
    ),
    icon: "file-earmark-text",
  },
  {
    text: "",
    field: "download",
    render: () => <button>Download</button>,
    icon: "download",
  },
]

const Dashboard: React.FC = () => {
  const { firestore, user } = useFirebase()
  const [completedReviews, setCompletedReviews] = useState<any[]>([])

  useEffect(() => {
    if (!firestore || !user) return

    const unsubscribe = () =>
      onSnapshot(
        getReviewsQuery({
          uid: user.uid,
          orderByField: "createdAt",
          loadLimit: 10,
        }),
        snapshot =>
          setCompletedReviews(
            snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
          ),
      )

    return unsubscribe()
  }, [firestore, user])

  return (
    <>
      <h2>Reviews</h2>

      <div className="card">
        <ReviewsCard data={completedReviews} tableHeader={tableColumns} />
      </div>
    </>
  )
}

export default Dashboard
