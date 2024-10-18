import { collection, orderBy, onSnapshot, query } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"

import "../../style/dashboard.css"
import StarRating from "../../components/star-rating"

function DashboardView() {
  const [scrapingUrl, setScrapingUrl] = useState("")
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  const db = useAppSelector(state => state.firebase.db)
  const user = useAppSelector(state => state.auth.user)

  useEffect(() => {
    if (!db) return
    setReviews([])
    let collectionReviews = collection(db, "reviews")
    const reviewsQuery = query(collectionReviews, orderBy("createdAt", "desc"))

    onSnapshot(reviewsQuery, querySnapshot => {
      setReviews([])
      querySnapshot.forEach(doc => {
        const data = doc.data()
        setReviews(prev => [
          ...prev,
          {
            ...data,
            id: doc.id,
          },
        ])
      })
    })
  }, [db])

  async function startScraping(url: string) {
    const encodeReviewURL = encodeURIComponent(url)
    await fetch(`http://localhost:3000/review?url=${encodeReviewURL}`)
    setScrapingUrl("")
  }

  // Pagination handling
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const downloadFile = async (url: string) => {
    const storage = getStorage()
    const fileRef = ref(storage, url)
    const fileUrl = await getDownloadURL(fileRef)

    window.open(fileUrl, "_blank")
  }

  return (
    <div className="dashboard pt-4">
      <div className="container">
        <div className="card">
          <div className="card-body">
            <table className="table dashboard__table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">
                    <i className="bi-geo" />
                    Places
                  </th>
                  <th scope="col">
                    <i className="bi-clock" />
                    Date
                  </th>
                  <th scope="col">
                    <i className="bi-download"></i>
                    File
                  </th>
                  <th scope="col">
                    <i className="bi-clipboard-check"></i>Status
                  </th>
                  <th scope="col">
                    <i className="bi-gear"></i>Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review: any, index: number) => {
                  return (
                    <tr>
                      <th scope="row">{indexOfFirstReview + index + 1}</th>
                      <td>
                        <div className="d-flex flex-column  dashboard__table-item">
                          <span>{review.info.mainTitle} </span>
                          <div className="d-flex gap-1 align-items-center">
                            <StarRating rating={review.info.mainRate} />
                            <span>{review.info.mainReview} reviews</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="dashboard__table-date">
                          <div className="d-flex gap-2">
                            <i className="bi-play-circle"></i>
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              },
                            )}{" "}
                            -{" "}
                            {new Date(review.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )}
                          </div>
                          <div className="d-flex gap-2 text-capitalize justify-content-end">
                            Done in -{" "}
                            {Math.round(
                              (new Date(review.completedAt).getTime() -
                                new Date(review.createdAt).getTime()) /
                                1000,
                            )}{" "}
                            seconds
                            <i className="bi-stop-circle"></i>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2 dashboard__table-file">
                          <button
                            onClick={() => downloadFile(review.fileUrl)}
                            className="btn btn-sm d-flex gap-2 px-3"
                          >
                            <i className="bi-download"></i>
                            Download JSON
                          </button>
                          <button
                            onClick={() => downloadFile(review.fileUrlCsv)}
                            className="btn btn-sm d-flex gap-2 px-3"
                          >
                            <i className="bi-download"></i>
                            Download CSV
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {/* review.status === "completed" ? "success" : review.status === "pending" ? "warning" : "danger" */}
                          <div
                            className={`dashboard__table-status ${
                              review.status === "completed"
                                ? "completed"
                                : review.status === "pending"
                                  ? "canceled"
                                  : "danger"
                            } py-1 px-2 `}
                          >
                            <span>
                              {review.status === "completed"
                                ? "Complated"
                                : "Pending"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2 dashboard__table-actions">
                          <button
                            onClick={() =>
                              (window.location.href = `/dashboard/review/${review.id}`)
                            }
                            className="btn btn-sm d-flex gap-2 px-3"
                          >
                            <i className="bi-eye"></i>
                            View
                          </button>
                          <button className="btn btn-sm d-flex gap-2 px-3">
                            <i className="bi-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="card my-2">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Map place link</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://"
                value={scrapingUrl}
                onChange={e => setScrapingUrl(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => startScraping(scrapingUrl)}
              disabled={!scrapingUrl}
            >
              Start scrapping
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col">Url</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review: any, index: number) => {
              return (
                <tr key={review.id}>
                  <th scope="row">{indexOfFirstReview + index + 1}</th>
                  {review.info ? (
                    <td>
                      <h6>
                        {review.info.mainTitle}{" "}
                        <i>{review.info.mainReview} reviews</i>
                      </h6>
                      <span className="badge bg-info">
                        {review.info.mainRate}
                      </span>
                    </td>
                  ) : null}
                  <td>
                    {new Date(review.createdAt).toLocaleString()}
                    <span className="badge bg-danger ms-2">
                      {Math.round(
                        (new Date(review.completedAt).getTime() -
                          new Date(review.createdAt).getTime()) /
                          1000,
                      )}
                      s
                    </span>
                  </td>
                  <td>
                    {review.fileUrl ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => downloadFile(review.fileUrl)}
                      >
                        Download JSON
                      </button>
                    ) : null}
                    <br />
                    {review.fileUrlCsv ? (
                      <button
                        className="btn btn-success"
                        onClick={() => downloadFile(review.fileUrlCsv)}
                      >
                        Download CSV
                      </button>
                    ) : null}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${review.status === "completed" ? "success" : review.status === "pending" ? "warning" : "danger"}`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <a
                      className="btn btn-primary"
                      href={`/dashboard/review/${review.id}`}
                    >
                      View
                    </a>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default DashboardView
