import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Table } from "../../components/table"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"
import { formatTimestamp } from "../../utils/formatTimestamp"
import { reviewsCountRender } from "../../utils/reviewsCountRender"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import { useNavigate } from "react-router-dom"
import { useMenu } from "../../context/MenuContext/MenuContext"
import menuIcon from "../../assets/icons/list.svg"

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { firestore, user } = useFirebase()
  const [info, setInfo] = useState<any>({})
  const [completedReviews, setCompletedReviews] = useState<any[]>([])
  const [selectedReviews, setSelectedReviews] = useState<any[]>([])
  const tableColumns = [
    {
      textRender: () => (
        <input type="checkbox" id="selectAll" onClick={selectAllCheckbox} />
      ),
      field: "index",
      render: (row: any) => (
        <input type="checkbox" onClick={selectCheckbox} id={row.id} />
      ),
    },
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

  const selectAllCheckbox = () => {
    const selectAll = document.getElementById("selectAll") as HTMLInputElement
    const selectAllValue = selectAll.checked
    const checkboxes = document.querySelectorAll("input[type=checkbox]")
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.id !== "selectAll") {
        checkbox.checked = selectAllValue
      }
    })
    setSelectedReviews(
      Array.from(checkboxes)
        .filter(
          (checkbox: any) => checkbox.checked && checkbox.id !== "selectAll",
        )
        .map((checkbox: any) => checkbox.id),
    )
  }

  const selectCheckbox = () => {
    const checkboxes = document.querySelectorAll("input[type=checkbox]")
    const selectAll = document.getElementById("selectAll") as HTMLInputElement
    let allChecked = true
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.id !== "selectAll" && !checkbox.checked) {
        allChecked = false
      }
    })
    selectAll.checked = allChecked
    setSelectedReviews(
      Array.from(checkboxes)
        .filter(
          (checkbox: any) => checkbox.checked && checkbox.id !== "selectAll",
        )
        .map((checkbox: any) => checkbox.id),
    )
  }

  const deleteSelectedReviews = async () => {
    if (!firestore || !user) return

    // Unselect all checkboxes
    const checkboxes = document.querySelectorAll("input[type=checkbox]")
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false
    })
    setSelectedReviews([])

    const batch = writeBatch(firestore)
    selectedReviews.forEach(reviewId => {
      const reviewRef = doc(firestore, `users/${user.uid}/reviews/${reviewId}`)
      batch.delete(reviewRef)
    })

    await batch.commit()
  }

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
          console.log(
            "snapshot.docs",
            snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
          )
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

  const { toggleMenu } = useMenu()

  return (
    <>
      <div className="d-flex align-items-center gap-3">
        <button className="sidebar-toggle-btn button" onClick={toggleMenu}>
          <img src={menuIcon} alt="menu-icon" />
        </button>
        <h3>Reviews</h3>
      </div>
      <div className="card">
        {info ? (
          <div className="card-body d-flex gap-3">
            <div>
              <p className="m-0">All comments</p>
              <h3 className="m-0">
                {info.totalReviews ? info.totalReviews : "0"}
              </h3>
            </div>
            <div>
              <p className="m-0">Owner responses</p>
              <h3 className="m-0">
                {info.totalOwnerReviews ? info.totalOwnerReviews : "0"}
              </h3>
            </div>
            <div>
              <p className="m-0">User comments</p>
              <h3 className="m-0">
                {info.totalUserReviews ? info.totalUserReviews : "0"}
              </h3>
            </div>
            <div>
              <p className="m-0">Images</p>
              <h3 className="m-0">
                {info.totalImages ? info.totalImages : "0"}
              </h3>
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="
        d-flex
        gap-3
        py-3
        border-bottom
        border-primary
      "
      >
        <a href="#" className="active">
          All
        </a>
        <a href="#">Completed</a>
        <a href="#">Pending</a>
        <a href="#">Failed</a>
      </div>
      <div className="d-flex justify-space-between py-3">
        <form action="" className="d-flex align-items-center gap-3">
          <div className="form-wrap mb-0">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search"
              className="form-input"
            />
          </div>
          <button className="button button-primary">Search</button>
        </form>
        <div className="d-flex">
          <button className="button button-primary">Filter</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header d-none">
          <h3>Reviews List ({completedReviews.length})</h3>
          <div className="actions">
            <button
              className="button button-danger button-lg"
              onClick={deleteSelectedReviews}
              disabled={selectedReviews.length === 0}
            >
              Delete{" "}
              {selectedReviews.length > 0 ? `(${selectedReviews.length})` : ""}
            </button>
          </div>
        </div>
        <div className="card-body">
          <Table tableHeader={tableColumns} body={completedReviews} />
        </div>
      </div>
    </>
  )
}

export default Dashboard
