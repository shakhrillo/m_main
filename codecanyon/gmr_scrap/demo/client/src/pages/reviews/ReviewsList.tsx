import { doc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table } from "../../components/table"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"
import { formatTimestamp } from "../../utils/formatTimestamp"
import { reviewsCountRender } from "../../utils/reviewsCountRender"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import Loader from "../../components/loader"

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { firestore, user } = useFirebase()
  const [info, setInfo] = useState<any>({})
  const [completedReviews, setCompletedReviews] = useState<any[]>([])
  const [activeTableFilter, setActiveTableFilter] = useState("all")

  const [loading, setLoading] = useState(false)

  const tableColumns = [
    {
      text: "Status",
      field: "status",
      render: (row: any) => statusRender(row.status, { width: 20, height: 20 }),
    },
    {
      text: "Place",
      field: "title",
      render: (row: any) => (
        <a
          className="d-inline-block text-truncate"
          style={{ maxWidth: "200px" }}
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
    setLoading(() => true)
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
      setInfo(doc.data() || {})
      setLoading(() => false)
      console.log("info", info)
    })
    return unsubscribe
  }, [firestore, user])

  return (
    <div className="container-fluid reviews">
      {loading ? (
        <Loader cover="full" version={2} />
      ) : (
        <div className="row">
          <div className="d-flex gap-2">
            <div className="rounded bg-light d-flex justify-content-center align-items-center reviews__icon">
              <img src={serverBoltIcon} alt="icon" width={"18px"} />
            </div>
            <h4>Reviews</h4>
          </div>
          <div className="col-12 mt-3 reviews__header">
            <ul className="d-flex p-0 list-unstyled">
              <li className="d-flex flex-column gap-2 border-end pe-5">
                <span className="text-muted">All comments</span>
                <h4>{info.totalReviews ? info.totalReviews : "0"}</h4>
              </li>
              <li className="d-flex flex-column gap-2 border-end px-5">
                <span className="text-muted">Owner responses</span>
                <h4>{info.totalOwnerReviews ? info.totalOwnerReviews : "0"}</h4>
              </li>
              <li className="d-flex flex-column gap-2 border-end px-5">
                <span className="text-muted">User comments</span>
                <h4>{info.totalUserReviews ? info.totalUserReviews : "0"}</h4>
              </li>
              <li className="d-flex flex-column gap-2 px-5">
                <span className="text-muted">Images</span>
                <h4>{info.totalImages ? info.totalImages : "0"}</h4>
              </li>
            </ul>
          </div>
          <div className="col-12 border-bottom">
            <ul className="table__filter list-unstyled d-flex m-0">
              <li
                className={`py-1 px-3 ${activeTableFilter === "all" ? "active" : ""}`}
                aria-current="page"
                onClick={() => setActiveTableFilter("all")}
              >
                All
              </li>
              <li
                className={`py-1 px-3 ${activeTableFilter === "completed" ? "active" : ""}`}
                aria-current="page"
                onClick={() => setActiveTableFilter("completed")}
              >
                Completed
              </li>
              <li
                className={`py-1 px-3 ${activeTableFilter === "pending" ? "active" : ""}`}
                aria-current="page"
                onClick={() => setActiveTableFilter("pending")}
              >
                Pending
              </li>
              <li
                className={`py-1 px-3 ${activeTableFilter === "failed" ? "active" : ""}`}
                aria-current="page"
                onClick={() => setActiveTableFilter("failed")}
              >
                Failed
              </li>
            </ul>
          </div>
          <div className="col-12 mt-4">
            <Table tableHeader={tableColumns} tableBody={completedReviews} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
