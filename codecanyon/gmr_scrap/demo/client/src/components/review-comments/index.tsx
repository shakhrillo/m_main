import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { imagesCountRender } from "../../utils/imagesCountRender"
import { reviewTextRender } from "../../utils/reviewTextRender"
import { Table } from "../table"
import ReviewImages from "../review-images"

function ReviewComments() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTableFilter, setActiveTableFilter] = useState("comments")

  useEffect(() => {
    if (!firestore || !place || !user) return

    const reviewsRef = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "reviews",
    )

    const q = query(reviewsRef, orderBy("time", "asc"))

    const unsubscribe = onSnapshot(q, async snapshot => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log(reviewsData)

      setReviews(reviewsData)
      setLoading(false)
      setError(null)
    })

    return unsubscribe
  }, [firestore, user, place])

  const tableHeader = [
    {
      text: "Data",
      field: "data",
      render: (row: any) => <span>{row.date}</span>,
    },
    {
      text: "Rating",
      field: "rating",
      render: (row: any) => <span>{row.rating}</span>,
    },
    {
      text: "Review",
      field: "review",
      render: (row: any) => <span>{reviewTextRender(row.review)}</span>,
    },
    {
      text: "QA",
      field: "qa",
      render: (row: any) => (
        <span>
          {row.qa.map((qa: any, index: number) => (
            <li key={index} className="list-group-item">
              <small className="text-nowrap">{qa}</small>
            </li>
          ))}
        </span>
      ),
    },
    {
      text: "Response",
      field: "response",
      render: (row: any) => <span>{reviewTextRender(row.response)}</span>,
    },
  ]

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="mt-5">
      <div className="btn-group reviews__table__filter my-4">
        <button
          type={"button"}
          className={`btn ${activeTableFilter === "comments" ? "active" : ""} reviews__table__filter__btn`}
          aria-current="page"
          onClick={() => setActiveTableFilter("comments")}
        >
          Comments
        </button>
        <button
          type={"button"}
          className={`btn ${activeTableFilter === "images" ? "active" : ""} reviews__table__filter__btn`}
          aria-current="page"
          onClick={() => setActiveTableFilter("images")}
        >
          Images
        </button>
        <button
          type={"button"}
          className={`btn ${activeTableFilter === "videos" ? "active" : ""} reviews__table__filter__btn`}
          aria-current="page"
          onClick={() => setActiveTableFilter("videos")}
        >
          Videos
        </button>
      </div>
      {activeTableFilter === "comments" ? (
        <Table tableHeader={tableHeader} tableBody={reviews} />
      ) : activeTableFilter === "images" ? (
        <ReviewImages />
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default ReviewComments
