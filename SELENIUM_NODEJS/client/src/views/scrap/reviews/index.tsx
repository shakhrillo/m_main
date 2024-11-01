import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import Pagination from "react-bootstrap/Pagination"
import { useAppSelector } from "../../../app/hooks"
import StarRating from "../../../components/star-rating"
import "../../../style/dashboard.css"
import { useFirebase } from "../../../contexts/FirebaseProvider"

function ScrapReviewsView() {
  const [show, setShow] = useState(false)

  const { firestore, user } = useFirebase()

  const [scrapingUrl, setScrapingUrl] = useState("https://maps.app.goo.gl/eUdPBiVDVRfP5zrr8")
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  const db = useAppSelector(state => state.firebase.db)
  // const user = useAppSelector(state => state.auth.user)
  const token = useAppSelector(state => state.auth.token)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    console.log("Loaded: ", reviews)
  }, [reviews])

  useEffect(() => {
    if (!firestore || !user) return;
    setReviews([])
    let collectionReviews = collection(firestore, `users/${user.uid}/reviews`)
    // const reviewsQuery = query(collectionReviews, orderBy("createdAt", "desc"))

    onSnapshot(collectionReviews, querySnapshot => {
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
  }, [firestore, user])

  async function startScraping(url: string) {
    const uid = user ? user.uid : ""
    // console.log(`users/${uid}/reviews`)
    // let collectionReviews = collection(firestore, `users/${uid}/reviews`);
    // await addDoc(collectionReviews, {
    //   url,
    //   uid
    // })

    const token = await user?.getIdToken()

    // with http
    await fetch("http://localhost:1337/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
      }),
    })

    setScrapingUrl("")
    handleClose()
  }

  async function deleteReview(id: string) {
    const uid = user ? user.uid : "";
    await deleteDoc(doc(firestore, `users/${uid}/reviews/${id}`));
    console.log("Document successfully deleted!");
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
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h1 className="h3 mb-3">Reviews</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="p-3 bg-light mb-3">
            <div className="input-group">
              <input
                type="text"
                id="reviewUrl"
                value={scrapingUrl}
                onChange={e => setScrapingUrl(e.target.value)}
                placeholder="Add the URL address"
                className="form-control"
              />
              <button
                onClick={() => startScraping(scrapingUrl)}
                className="btn btn-primary"
                disabled={scrapingUrl === ""}
              >
                Add Review
              </button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <table className="table custom-table">
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
                  <i className="bi-stopwatch" />
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
                      {review.title ? (
                        <div className="d-flex flex-column">
                          <a href={`${review.url}`} target="_blank">
                            {review.title}
                          </a>
                          <div className="d-flex gap-1 align-items-center">
                            {/* <StarRating rating={review.info.mainRate} /> */}
                            <span>{review.totalReviews || 0} reviews</span>
                          </div>
                          <div className="d-flex gap-1 align-items-center">
                            <span>Completed:</span>
                            <span className="badge bg-info">
                              {
                                review.completedAt && review.createdAt ? (
                                  Number((review.completedAt.seconds - review.createdAt.seconds) / 60).toFixed(2) + " min"
                                ) : (
                                  "Loading..."
                                )
                              }
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex flex-column">
                          <span>Loading...</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <div className="d-flex flex-column">
                          {(review.createdAt && review.createdAt.seconds) ? (
                            <div className="d-flex flex-column gap-2">
                              <span>
                                {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                              </span>
                              <small>
                                {new Date(review.createdAt.seconds * 1000).toLocaleTimeString()}
                              </small>
                            </div>
                          ) : (
                            <span>Loading...</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                    {review.completedAt && review.completedAt.seconds ? (
                      <div className="d-flex flex-column gap-2">
                        <span>
                          {new Date(review.completedAt.seconds * 1000).toLocaleDateString()}
                        </span>
                        <small>
                          {new Date(review.completedAt.seconds * 1000).toLocaleTimeString()}
                        </small>
                      </div>
                    ) : (
                      <span>Loading...</span>
                    )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option value={review.fileUrl}>JSON</option>
                          <option value={review.fileUrlCsv}>CSV</option>
                        </select>

                        <button
                          onClick={() => downloadFile(review.fileUrl)}
                          className="btn"
                        >
                          <i className="bi-download"></i>
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
                            (window.location.href = `/dashboard/scrap/review/${review.id}`)
                          }
                          className="btn btn-outline-secondary"
                        >
                          <i className="bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deleteReview(review.id)}
                        >
                          <i className="bi-trash"></i>
                        </button>
                        {/* session play btn */}
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            window.location.href = `${review.seleniumSession}`
                          }}
                        >
                          <i className="bi-play"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12">
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
  )
}

export default ScrapReviewsView
