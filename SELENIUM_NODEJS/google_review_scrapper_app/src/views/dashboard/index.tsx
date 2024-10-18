import { collection, orderBy, onSnapshot, query } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import Pagination from "react-bootstrap/Pagination"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

import "../../style/dashboard.css"
import StarRating from "../../components/star-rating"

function DashboardView() {
  const [show, setShow] = useState(false)

  const [scrapingUrl, setScrapingUrl] = useState("")
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  const db = useAppSelector(state => state.firebase.db)
  const user = useAppSelector(state => state.auth.user)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
    handleClose()
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
            <div className="d-flex justify-content-between align-items-center">
              <div className="dashboard__scrapper">
                <input
                  type="text"
                  id="reviewUrl"
                  value={scrapingUrl}
                  onChange={e => setScrapingUrl(e.target.value)}
                  placeholder="Add the URL address"
                />
                <button
                  className="btn"
                  onClick={() => startScraping(scrapingUrl)}
                >
                  Add Review
                </button>
              </div>
              {/* <h2>Dashboard</h2> */}
              {/* <Button variant="primary" onClick={handleShow}>
                <i className="bi-plus"></i>
                Add Review
              </Button> */}
            </div>
          </div>
        </div>
        <hr />
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
                    Created
                  </th>
                  <th scope="col">
                    <i className="bi-clock" />
                    Completed
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
                    <tr key={review.id}>
                      <th scope="row">{indexOfFirstReview + index + 1}</th>
                      <td>
                        {review.info ? (
                          <div className="d-flex flex-column  dashboard__table-item">
                            <span>{review.info.mainTitle} </span>
                            <div className="d-flex gap-1 align-items-center">
                              <StarRating rating={review.info.mainRate} />
                              <span>{review.info.mainReview} reviews</span>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-column  dashboard__table-item">
                            <span>Loading...</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <i className="bi-clock"></i>
                          <div className="d-flex flex-column">
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <small>
                              {new Date(review.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <i className="bi-clock"></i>
                          <div className="d-flex flex-column">
                            <span>
                              {new Date(
                                review.completedAt,
                              ).toLocaleDateString()}
                            </span>
                            <small>
                              {new Date(
                                review.completedAt,
                              ).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => downloadFile(review.fileUrl)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi-download me-2"></i>
                            JSON
                          </button>
                          <button
                            onClick={() => downloadFile(review.fileUrlCsv)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi-download me-2"></i>
                            CSV
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <span
                            className={`p-2 badge bg-${review.status === "completed" ? "success" : review.status === "pending" ? "warning" : "danger"}`}
                          >
                            {review.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() =>
                              (window.location.href = `/dashboard/review/${review.id}`)
                            }
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="bi-eye"></i>
                            View
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
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
          <div className="card-footer">
            <Pagination>
              <Pagination.First onClick={() => handlePageClick(1)} />
              <Pagination.Prev onClick={handlePreviousPage} />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => handlePageClick(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={handleNextPage} />
              <Pagination.Last onClick={() => handlePageClick(totalPages)} />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
