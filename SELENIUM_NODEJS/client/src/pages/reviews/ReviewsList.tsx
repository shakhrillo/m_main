import { onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Table } from "../../components/table"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"
import { formatTimestamp } from "../../utils/formatTimestamp"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import { reviewsCountRender } from "../../utils/reviewsCountRender"

const tableColumns = [
  {
    textRender: () => <input type="checkbox" />,
    field: "index",
    render: () => <input type="checkbox" />,
  },
  {
    text: "Status",
    field: "status",
    render: (row: any) => statusRender(row.status, false),
  },
  {
    text: "Place",
    field: "title",
    render: (row: any) => (
      <a href={`/reviews/${row.id}`}>{row.title || row.url}</a>
    ),
  },
  {
    text: "Date",
    field: "createdAt",
    render: (row: any) => <span>{formatTimestamp(row.createdAt)}</span>,
  },
  {
    text: "Reviews",
    field: "totalReviews",
    render: (row: any) => reviewsCountRender(row),
  },
  {
    text: "Time",
    field: "timeSpent",
    render: (row: any) => spentTime(row),
  },
  {
    text: "",
    field: "csv",
    render: (row: any) => <a href={row.csvUrl}>Csv</a>,
  },
  {
    text: "",
    field: "json",
    render: (row: any) => <a href={row.jsonUrl}>JSON</a>,
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
        <Table tableHeader={tableColumns} body={completedReviews} />
      </div>
    </>
  )
}

export default Dashboard
