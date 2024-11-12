import { doc, onSnapshot, writeBatch } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Table } from "../../components/table"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { getReviewsQuery } from "../../services/firebaseService"
import { formatTimestamp } from "../../utils/formatTimestamp"
import { reviewsCountRender } from "../../utils/reviewsCountRender"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import { useNavigate } from "react-router-dom"

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { firestore, user } = useFirebase()
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
      render: (row: any) => statusRender(row.status, false),
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
        <div className="card-info">
          <h3>Completed Reviews ({completedReviews.length})</h3>
          <div className="card-actions">
            <button
              className="button button-primary"
              onClick={deleteSelectedReviews}
            >
              Delete{" "}
              {selectedReviews.length > 0 ? `(${selectedReviews.length})` : ""}
            </button>
          </div>
        </div>
        <Table tableHeader={tableColumns} body={completedReviews} />
      </div>
    </>
  )
}

export default Dashboard
