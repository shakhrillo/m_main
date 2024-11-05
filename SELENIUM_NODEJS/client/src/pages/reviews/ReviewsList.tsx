import
  {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
  } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap"
import { useFirebase } from "../../contexts/FirebaseProvider"

const sortBy = [
  "Most Relevant",
  "Newest",
  "Lowest rating",
  "Highest rating",
]

const defaultScrap = {
  url: "https://maps.app.goo.gl/y5NbtGn4iWqndgsQ8",
  limit: 5000,
  sortBy: sortBy[1],
  extractImageUrls: false,
  ownerResponse: true,
  onlyGoogleReviews: false,
}

function ReviewsList() {
  const { firestore, user } = useFirebase()

  const [scrap, setScrap] = useState(defaultScrap)
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  useEffect(() => {
    if (!firestore || !user) return
    setReviews([])
    let collectionReviews = collection(firestore, `users/${user.uid}/reviews`)
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
  }, [firestore, user])

  async function startScraping() {
    if (!firestore || !user) return
    setScrap(defaultScrap);
    const collectionReviews = collection(firestore, `users/${user?.uid}/reviews`);
    const token = await user.getIdToken();
    const docRef = await addDoc(collectionReviews, {
      ...scrap,
      status: "in-progress",
      createdAt: new Date(),
      token
    })
    console.log("Document written with ID: ", docRef.id)
  }

  async function deleteReview(id: string) {
    const uid = user ? user.uid : ""
    await deleteDoc(doc(firestore, `users/${uid}/reviews/${id}`))
    console.log("Document successfully deleted!")
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

  const downloadFile = async (review: any, id: string) => {
    const selected = document.getElementById(id) as HTMLSelectElement;
    if (!selected) return
    const selectedValue = selected.value || "json";
    const url = review[selectedValue + "Url"];
    const storage = getStorage()
    const fileRef = ref(storage, url)
    const fileUrl = await getDownloadURL(fileRef)

    window.open(fileUrl, "_blank")
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
    <div className="row">
      <div className="col-3">
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Sharable URL</label>
                <input type="email" className="form-control" placeholder="Place URL" value={scrap.url} onChange={e => setScrap({ ...scrap, url: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Extract limit
                </label>
                <input type="number" className="form-control" placeholder="Extract limit" disabled value={scrap.limit} onChange={e => setScrap({ ...scrap, limit: parseInt(e.target.value) })} />
                <div className="form-text">
                  For demo purposes, the extract limit is disabled.
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Sort by
                </label>
                <select className="form-select" value={scrap.sortBy} onChange={e => setScrap({ ...scrap, sortBy: e.target.value })}>
                  {sortBy.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" checked={scrap.extractImageUrls} onChange={e => setScrap({ ...scrap, extractImageUrls: e.target.checked })} />
                <label className="form-label">
                  Extract image urls
                </label>
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" checked={scrap.ownerResponse} onChange={e => setScrap({ ...scrap, ownerResponse: e.target.checked })} />
                <label className="form-label">
                  Owner response
                </label>
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" checked={scrap.onlyGoogleReviews} onChange={e => setScrap({ ...scrap, onlyGoogleReviews: e.target.checked })} />
                <label className="form-label">
                  Only Google reviews
                </label>
              </div>
            </form>
            <button
              className="btn btn-primary w-100 mt-3"
              type="button"
              onClick={() => startScraping()}
            >
              Start
            </button>
            
            <small className="form-text text-muted">
              The scraping process may take a few minutes.
            </small>
          </div>
        </div>
      </div>
      <div className="col-9">
        <div className="card">
          <div className="card-body">
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
                      <i className={item.icon}></i>
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReviews.map(review => (
                  <tr key={review.id}>
                    <td>
                      <div className="d-flex">
                        <div
                          className={`geo-badge ${review.status === "completed" ? "success" : "danger"}`}
                        >
                          {renderStatus(review.status)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`/reviews/${review.id}`}>
                        {review?.title?.replace(/ - Google Maps/g, "")}
                      </a>
                    </td>
                    <td>{formatTime(review.createdAt)}</td>
                    <td>{renderCount(review)}</td>
                    <td>{spentTime(review.createdAt, review.completedAt)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          aria-label={`Download ${review.title}`}
                          id={`download-${review.id}`}
                        >
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                        </select>
                        <button
                          className="btn btn-primary"
                          onClick={() => downloadFile(review, `download-${review.id}`)}
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
          <div className="card-footer">
            <Pagination>
              <Pagination.First
                onClick={() => handlePageClick(1)}
                disabled={currentPage === 1}
              >
                <i className="bi-chevron-double-left"></i>
              </Pagination.First>
              <Pagination.Prev
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <i className="bi-chevron-left"></i>
              </Pagination.Prev>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => handlePageClick(i + 1)}
                  disabled={currentPage === i + 1}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <i className="bi-chevron-right"></i>
              </Pagination.Next>
              <Pagination.Last
                onClick={() => handlePageClick(totalPages)}
                disabled={currentPage === totalPages}
              >
                <i className="bi-chevron-double-right"></i>
              </Pagination.Last>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsList
