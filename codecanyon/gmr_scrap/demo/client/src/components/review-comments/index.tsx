import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { imagesCountRender } from "../../utils/imagesCountRender"
import { reviewTextRender } from "../../utils/reviewTextRender"
import { Table } from "../table"

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

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="mt-5">
      <div className="btn-group reviews__table__filter mt-3">
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
          className={`btn ${activeTableFilter === "pending" ? "active" : ""} reviews__table__filter__btn`}
          aria-current="page"
          onClick={() => setActiveTableFilter("pending")}
        >
          Pending
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
      {/* <Table
        tableHeader={[
          { text: "#" },
          { text: "Data" },
          { text: "Rating" },
          { text: "Review" },
          { text: "QA" },
          { text: "Response" },
        ]}
        tableBody={reviews}
      /> */}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Rating</th>
            <th>Images</th>
            <th>Review</th>
            <th>QA</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{review.date}</td>
              <td>{review.rating}</td>
              <td>
                {review.media.length > 0 ? (
                  <div className="row g-2">
                    {review.media.map((media: any, index: number) => (
                      <div key={index} className="col-6">
                        <a
                          href={media.videoUrl || media.thumb}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            key={index}
                            src={media.thumb}
                            alt={`Review ${index + 1}`}
                            className={
                              "img-thumbnail" +
                              (media.videoUrl ? " border border-danger" : "")
                            }
                            style={{ minWidth: "60px" }}
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  "No images"
                )}
              </td>
              <td>{reviewTextRender(review.review)}</td>
              <td>
                <ul className="list-group">
                  {review.qa.map((qa: any, index: number) => (
                    <li key={index} className="list-group-item">
                      <small className="text-nowrap">{qa}</small>
                    </li>
                  ))}
                </ul>
              </td>
              <td>{reviewTextRender(review.response)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReviewComments
