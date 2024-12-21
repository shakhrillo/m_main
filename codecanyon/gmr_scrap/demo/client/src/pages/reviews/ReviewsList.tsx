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

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { firestore, user } = useFirebase()
  const [info, setInfo] = useState<any>({})
  const [completedReviews, setCompletedReviews] = useState<any[]>([])
  const [activeTableFilter, setActiveTableFilter] = useState("all")

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
    <div className="container-fluid reviews">
      <div className="row">
        <div className="d-flex gap-2">
          <div className="rounded bg-light d-flex justify-content-center align-items-center reviews__icon">
            <img src={serverBoltIcon} alt="icon" width={"18px"} />
          </div>
          <h4 className="reviews__title">Reviews</h4>
        </div>
        <div className="col-12 mt-3 reviews__header">
          <ul className="d-flex p-0 list-unstyled reviews__header__menu">
            <li className="d-flex flex-column gap-2 border-end pe-5 reviews__header__menu__item">
              <span className="text-muted reviews__header__menu__item__span">
                All comments
              </span>
              <h4 className="reviews__header__menu__item__heading">
                {info.totalReviews ? info.totalReviews : "0"}
              </h4>
            </li>
            <li className="d-flex flex-column gap-2 border-end px-5">
              <span className="text-muted reviews__header__menu__item__span">
                Owner responses
              </span>
              <h4 className="reviews__header__menu__item__heading">
                {info.totalOwnerReviews ? info.totalOwnerReviews : "0"}
              </h4>
            </li>
            <li className="d-flex flex-column gap-2 border-end px-5">
              <span className="text-muted reviews__header__menu__item__span">
                User comments
              </span>
              <h4 className="reviews__header__menu__item__heading">
                {info.totalUserReviews ? info.totalUserReviews : "0"}
              </h4>
            </li>
            <li className="d-flex flex-column gap-2 px-5">
              <span className="text-muted reviews__header__menu__item__span">
                Images
              </span>
              <h4 className="reviews__header__menu__item__heading">
                {info.totalImages ? info.totalImages : "0"}
              </h4>
            </li>
          </ul>
        </div>
        <div className="col-12 border-bottom review__table">
          <div className="btn-group reviews__table__filter mt-3">
            <button
              type={"button"}
              className={`btn ${activeTableFilter === "all" ? "active" : ""} reviews__table__filter__btn`}
              aria-current="page"
              onClick={() => setActiveTableFilter("all")}
            >
              All
            </button>
            <button
              type={"button"}
              className={`btn ${activeTableFilter === "completed" ? "active" : ""} reviews__table__filter__btn`}
              aria-current="page"
              onClick={() => setActiveTableFilter("completed")}
            >
              Completed
            </button>
            <button
              type={"button"}
              className={`btn ${activeTableFilter === "pending" ? "active" : ""} reviews__table__filter__btn`}
              aria-current="page"
              onClick={() => setActiveTableFilter("pending")}
            >
              Pending
            </button>
            <button
              type={"button"}
              className={`btn ${activeTableFilter === "failed" ? "active" : ""} reviews__table__filter__btn`}
              aria-current="page"
              onClick={() => setActiveTableFilter("failed")}
            >
              Failed
            </button>
          </div>
        </div>
        <div className="col-12 mt-4">
          <Table tableHeader={tableColumns} tableBody={completedReviews} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
