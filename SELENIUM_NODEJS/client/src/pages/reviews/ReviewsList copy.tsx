import
  {
    collection,
    onSnapshot,
    orderBy,
    query,
    Timestamp
  } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { downloadFile, getReviewsQuery, startExtractGmapReviews } from "../../services/firebaseService"

const sortBy = ["Most Relevant", "Newest", "Lowest rating", "Highest rating"]

const defaultScrap = {
  url: "",
  limit: 50,
  sortBy: sortBy[1],
  extractImageUrls: false,
  ownerResponse: true,
  onlyGoogleReviews: false
}

function ReviewsList() {
  const { firestore, user } = useFirebase()

  const [scrap, setScrap] = useState(defaultScrap)
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  useEffect(() => {
    if (!firestore || !user) return;
  
    const unsubscribe = onSnapshot(getReviewsQuery(user.uid), querySnapshot => {
      const reviewsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setReviews(reviewsData);
    });
  
    return () => unsubscribe();
  }, [firestore, user]);  

  async function startScraping() {
    if (!firestore || !user) return
    setScrap(defaultScrap)
    await startExtractGmapReviews(user.uid, scrap)
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

  function renderCount(review: any) {
    if (!review || !review.extractedReviews)
      return <i className="bi-question-lg"></i>
    let count = review.extractedReviews || 0
    if (count < (review.totalReviews || 0)) {
      count = review.totalReviews
    }

    return <span>{count} reviews</span>
  }

  function renderStatus(status: string) {
    switch (status) {
      case "completed":
        return <i className="bi-check-lg"></i>
      case "failed":
        return <i className="bi-x-lg"></i>
      case "in-progress":
        return <i className="bi-arrow-repeat"></i>
      default:
        return <i className="bi-question-lg"></i>
    }
  }

  function formatTime(date: Timestamp) {
    if (!date || !date.seconds) return ""

    const d = new Date(date.seconds * 1000)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  }

  function spentTime(start: Timestamp, end: Timestamp) {
    if (!start || !end) return ""

    const diff = end.seconds - start.seconds
    if (diff < 60) {
      return `${diff} seconds`
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes`
    } else {
      return `${Math.floor(diff / 3600)} hours`
    }
  }

  return (
    <div className="reviews row">
      <div className="col-3">
        <div className="reviews__scrap">
          <div>
            <form className="reviews__scrap__form">
              <div className="reviews__scrap__form__group">
                <label className="reviews__scrap__form__group__label">
                  Sharable URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Place URL"
                  value={scrap.url}
                  onChange={e => setScrap({ ...scrap, url: e.target.value })}
                />
              </div>
              <div className="reviews__scrap__form__group">
                <label className="reviews__scrap__form__group__label">
                  Extract limit
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Extract limit"
                  value={scrap.limit}
                  onChange={e =>
                    setScrap({ ...scrap, limit: parseInt(e.target.value) })
                  }
                />
                <span className="reviews__scrap__form__group__text">
                  For demo purposes, the extract limit is disabled.
                </span>
              </div>
              <div className="reviews__scrap__form__group">
                <label className="reviews__scrap__form__group__label">
                  Sort by
                </label>
                <select
                  className="form-select"
                  value={scrap.sortBy}
                  onChange={e => setScrap({ ...scrap, sortBy: e.target.value })}
                >
                  {sortBy.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="reviews__scrap__form__group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={scrap.extractImageUrls}
                  onChange={e =>
                    setScrap({ ...scrap, extractImageUrls: e.target.checked })
                  }
                />
                <label className="reviews__scrap__form__group__label">
                  Extract image urls
                </label>
              </div>
              <div className="reviews__scrap__form__group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={scrap.ownerResponse}
                  onChange={e =>
                    setScrap({ ...scrap, ownerResponse: e.target.checked })
                  }
                />
                <label className="reviews__scrap__form__group__label">
                  Owner response
                </label>
              </div>
              <div className="reviews__scrap__form__group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={scrap.onlyGoogleReviews}
                  onChange={e =>
                    setScrap({ ...scrap, onlyGoogleReviews: e.target.checked })
                  }
                />
                <label className="reviews__scrap__form__group__label">
                  Only Google reviews
                </label>
              </div>
              <button
                className="btn btn-primary"
                onClick={e => {
                  e.preventDefault()
                  startScraping()
                }}
                disabled={!scrap.url}
              >
                Start
              </button>
            </form>
            <div className="reviews__scrap__form__group"></div>

            <span className="reviews__scrap__form__group__text">
              The scraping process may take a few minutes.
            </span>
          </div>
        </div>
      </div>
      <div className="col-9">
        <div className="reviews__scrap-list">
          <div className="reviews__scrap-list__table">
            <table className="table">
              <thead>
                <tr>
                  {[
                    {
                      title: "#",
                      icon: "",
                    },
                    {
                      title: "Place",
                      icon: "bi-geo",
                    },
                    {
                      title: "Date",
                      icon: "bi-clock",
                    },
                    {
                      title: "Reviews",
                      icon: "bi-chat-square-text",
                    },
                    {
                      title: "Time",
                      icon: "bi-hourglass",
                    },
                    {
                      title: "Download",
                      icon: "bi-cloud-download",
                    },
                  ].map((item, index) => (
                    <th scope="col" key={index}>
                      <div className="reviews__scrap-list__table__header">
                        {item.icon ? <i className={item.icon}></i> : ""}
                        {item.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReviews.map(review => (
                  <tr key={review.id}>
                    <td>
                      <div
                        className={`reviews__scrap-list__table__status reviews__scrap-list__table__status--${review.status}`}
                        // className={`reviews__scrap-list__table__status ${review.status === "completed" ? "reviews__scrap-list__table__status--success" : "reviews__scrap-list__table__status--danger"}÷`}
                      >
                        {renderStatus(review.status)}
                      </div>
                    </td>
                    <td>
                      <div className="reviews__scrap-list__table__text">
                        <a href={`/reviews/${review.id}`}>
                          {review?.title?.replace(/ - Google Maps/g, "")}
                        </a>
                      </div>
                      <span className="d-block">
                      {/* spentInMinutes,
                      scrolledReviews: storIdJson.length */}
                        <small>
                          {review?.totalReviews}
                        </small>
                        <small>
                          {review?.spentInMinutes
                            ? `${review?.spentInMinutes.toFixed(2)} minutes`
                            : ""}
                        </small>
                      </span>
                      <span
                        className={`reviews__scrap-list__table__status--text reviews__scrap-list__table__status--${review.status}`}
                      >
                        {review?.status}
                      </span>
                    </td>
                    <td>
                      <div className="reviews__scrap-list__table__text">
                        {formatTime(review.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="reviews__scrap-list__table__text">
                        {renderCount(review)}
                      </div>
                    </td>
                    <td>
                      <div className="reviews__scrap-list__table__text">
                        {spentTime(review.createdAt, review.completedAt)}
                      </div>
                    </td>
                    <td>
                      <div className="reviews__scrap-list__table__download">
                        <select
                          className="form-select"
                          aria-label={`Download ${review.title}`}
                          id={`download-${review.id}`}
                          disabled={review.status !== "completed"}
                        >
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                        </select>
                        <button
                          className="btn btn-primary"
                          disabled={review.status !== "completed"}
                          onClick={async () => {
                            const selectedValue = (document.getElementById(`download-${review.id}`) as HTMLSelectElement).value || "json";
                            console.log("selectedValue", selectedValue)
                            let url;
                            if (selectedValue === "json") {
                              url = review.jsonUrl;
                            } else {
                              url = review.csvUrl;
                            }
                            const downloadUrl = await downloadFile(url);
                            window.open(downloadUrl, "_blank");
                          }}
                        >
                          <i className="bi bi-cloud-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="scrap-pagination">
            <ul className="pagination">
              {/* Previous Button (Double Left) */}
              <li
                className={`pagination__item ${currentPage === 1 ? "pagination__item--disabled" : ""}`}
              >
                <a
                  className="pagination__item__button pagination__link"
                  onClick={() => handlePageClick(1)}
                >
                  <i className="bi-chevron-double-left pagination__icon"></i>
                </a>
              </li>

              {/* Previous Button */}
              <li
                className={`pagination__item ${currentPage === 1 ? "pagination__item--disabled" : ""}`}
              >
                <a
                  className="pagination__item__button pagination__link"
                  onClick={handlePreviousPage}
                >
                  <i className="bi-chevron-left pagination__icon"></i>
                </a>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <li
                  key={pageIndex + 1}
                  className={`pagination__item ${currentPage === pageIndex + 1 ? "pagination__item--active" : ""}`}
                >
                  <a
                    className="pagination__item__button pagination__link"
                    onClick={() => handlePageClick(pageIndex + 1)}
                  >
                    {pageIndex + 1}
                  </a>
                </li>
              ))}

              {/* Next Button */}
              <li
                className={`pagination__item ${currentPage === totalPages ? "pagination__item--disabled" : ""}`}
              >
                <a
                  className="pagination__item__button pagination__link"
                  onClick={handleNextPage}
                >
                  <i className="bi-chevron-right pagination__icon"></i>
                </a>
              </li>

              {/* Next Button (Double Right) */}
              <li
                className={`pagination__item ${currentPage === totalPages ? "pagination__item--disabled" : ""}`}
              >
                <a
                  className="pagination__item__button pagination__link"
                  onClick={() => handlePageClick(totalPages)}
                >
                  <i className="bi-chevron-double-right pagination__icon"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default ReviewsList
