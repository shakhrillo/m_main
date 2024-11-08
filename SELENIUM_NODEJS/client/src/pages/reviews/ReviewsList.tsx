import { onSnapshot, Timestamp } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import ReviewsCard from "../../components/reviews-card"
import { ReviewsForm } from "../../components/reviews-form"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"

// Utility functions
const renderReviewCount = (review: any) =>
  <span>{review?.totalReviews || <i className="bi-question-lg"></i>} reviews</span>

const formatTimestamp = (timestamp: Timestamp) =>
  timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : ""

const calculateElapsedTime = (start: Timestamp, end: Timestamp) => {
  const diffInSeconds = (end?.seconds || 0) - (start?.seconds || 0)
  return diffInSeconds < 60 ? `${diffInSeconds} seconds`
    : diffInSeconds < 3600 ? `${Math.floor(diffInSeconds / 60)} minutes`
    : `${Math.floor(diffInSeconds / 3600)} hours`
}

// Table configuration for Review Cards
const tableColumns = [
  { text: "#", field: 'index', render: (_: any, index: number) => index + 1 },
  { text: "Place", field: 'title', render: (row: any) => <a href={`/reviews/${row.id}`}>{row.title || row.url}</a> },
  { text: "Date", field: 'createdAt', render: (row: any) => <span>{formatTimestamp(row.createdAt)}</span> },
  { text: "Reviews", field: 'totalReviews', render: renderReviewCount },
  { text: "Time", field: 'timeSpent', render: (row: any) => calculateElapsedTime(row.createdAt, row.completedAt) },
  {
    text: "File Format", field: 'format', render: () => (
      <select className="geo-select">
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>
    )
  },
  { text: "", field: 'download', render: () => <a><i className="bi bi-cloud-download"></i></a> },
]

// Reusable StatusCard component
const StatusCard = ({ data, statusText, badgeType }: any) => (
  <ReviewsCard
    data={data}
    statusText={statusText}
    badgeType={badgeType}
    tableHeader={tableColumns}
  />
)

const Dashboard: React.FC = () => {
  const { firestore, user } = useFirebase()
  const [inProgressReviews, setInProgressReviews] = useState<any[]>([])
  const [completedReviews, setCompletedReviews] = useState<any[]>([])
  const [failedReviews, setFailedReviews] = useState<any[]>([])

  useEffect(() => {
    if (!firestore || !user) return

    const fetchReviewsByStatus = (status: string, setData: React.Dispatch<any>) =>
      onSnapshot(
        getReviewsQuery({ uid: user.uid, status, orderByField: "createdAt", loadLimit: 5 }),
        snapshot => setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      )

    const unsubscribeCompleted = fetchReviewsByStatus("completed", setCompletedReviews)
    const unsubscribeInProgress = fetchReviewsByStatus("in-progress", setInProgressReviews)
    const unsubscribeFailed = fetchReviewsByStatus("failed", setFailedReviews)

    return () => {
      unsubscribeCompleted()
      unsubscribeInProgress()
      unsubscribeFailed()
    }
  }, [firestore, user])

  return (
    <div className="geo-dashboard">
      <div className="geo-dashboard__wrapper">
        <div className="geo-dashboard__header">
          <ReviewsForm />
        </div>
        <div className="geo-dashboard__view-all">
          <a className="geo-dashboard__view-all__btn">
            <i className="bi bi-grid"></i> View All
          </a>
        </div>

        <StatusCard data={inProgressReviews} statusText="In Progress" badgeType="warning" />
        <StatusCard data={completedReviews} statusText="Done" badgeType="success" />
        <StatusCard data={failedReviews} statusText="Canceled" badgeType="danger" />
      </div>
    </div>
  )
}

export default Dashboard
