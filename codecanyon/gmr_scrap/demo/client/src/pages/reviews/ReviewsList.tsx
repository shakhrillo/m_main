import { doc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table } from "../../components/table"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"
import { formatTimestamp } from "../../utils/formatTimestamp"
import { reviewsCountRender } from "../../utils/reviewsCountRender"
import { spentTime } from "../../utils/spentTime"

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { firestore, user } = useFirebase()
  const [info, setInfo] = useState<any>({})
  const [completedReviews, setCompletedReviews] = useState<any[]>([])
  const tableColumns = [
    {
      text: "Status",
      field: "status",
      render: (row: any) => row.status,
    },
    {
      text: "Place",
      field: "title",
      render: (row: any) => (
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            navigate(`/reviews/${row.id}`)
          }}
        >
          {row.title || row.url}
        </a>
      ),
    },
    {
      text: "Limit",
      field: "limit",
      render: (row: any) => <span>{row.limit}</span>,
    },
    {
      text: "Date",
      field: "createdAt",
      render: (row: any) => <span>{formatTimestamp(row.createdAt)}</span>,
    },
    {
      text: "Updated",
      field: "updatedAt",
      render: (row: any) => <span>{formatTimestamp(row.updatedAt)}</span>,
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

  useEffect(() => {
    if (!firestore || !user) return

    const unsubscribe = () =>
      onSnapshot(
        getReviewsQuery({
          uid: user.uid,
          orderByField: "createdAt",
          loadLimit: 1000,
        }),
        snapshot => {
          setCompletedReviews(
            snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
          )
        },
      )

    return unsubscribe()
  }, [firestore, user])

  useEffect(() => {
    if (!firestore || !user) return

    const docRef = doc(firestore, `app/info`)
    const unsubscribe = onSnapshot(docRef, doc => {
      setInfo(doc.data())
    })

    return unsubscribe
  }, [firestore, user])

  return (
    <div className="container-fluid">
      <div className="row">
        <h3>Reviews</h3>
        <div className="col-12">
          <ul className="list-group list-group-horizontal">
            <li className="list-group-item">
              <span>All comments</span>
              <div className="display-3">
                {info.totalReviews ? info.totalReviews : "0"}
              </div>
            </li>
            <li className="list-group-item">
              <span>Owner responses</span>
              <div className="display-3">
                {info.totalOwnerReviews ? info.totalOwnerReviews : "0"}
              </div>
            </li>
            <li className="list-group-item">
              <span>User comments</span>
              <div className="display-3">
                {info.totalUserReviews ? info.totalUserReviews : "0"}
              </div>
            </li>
            <li className="list-group-item">
              <span>Images</span>
              <div className="display-3">
                {info.totalImages ? info.totalImages : "0"}
              </div>
            </li>
          </ul>
        </div>
        <div className="col-12">
          <div className="btn-group my-3">
            <a href="#" className="btn btn-primary active" aria-current="page">
              All
            </a>
            <a href="#" className="btn btn-primary">
              Completed
            </a>
            <a href="#" className="btn btn-primary">
              Pending
            </a>
            <a href="#" className="btn btn-primary">
              Failed
            </a>
          </div>
        </div>
        <div className="col-12">
          <Table tableHeader={tableColumns} tableBody={completedReviews} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
