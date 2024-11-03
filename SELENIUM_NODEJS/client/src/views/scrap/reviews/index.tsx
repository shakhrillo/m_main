import {
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
import { Pagination, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { useFirebase } from "../../../contexts/FirebaseProvider"
import "../../../style/dashboard.css"

function ScrapReviewsView() {
  const { firestore, user } = useFirebase()

  const [scrapingUrl, setScrapingUrl] = useState(
    "https://maps.app.goo.gl/cGWBC5Y3GMPVFBkv6",
  )
  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedValue, setSelectedValue] = useState("all")
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

  async function startScraping(url: string) {
    setScrapingUrl("")
    const token = await user?.getIdToken()

    // const url = `http://34.122.24.195`;
    await fetch("http://127.0.0.1:1337/api/reviews", {
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

  const downloadFile = async (url: string) => {
    const storage = getStorage()
    const fileRef = ref(storage, url)
    const fileUrl = await getDownloadURL(fileRef)

    window.open(fileUrl, "_blank")
  }

  function renderCount(review: any) {
    if (!review || !review.extractedReviews)
      return <i className="bi-question-lg"></i>
    let count = review.extractedReviews || 0
    if (!count) {
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
    <div className="reviews card bg-transparent">
      <div className="card-body border-0">
        <div className="card border-0 bg-transparent">
          <div className="card-body">
            <div className="row">
              <div className="col-6 d-flex gap-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    placeholder="Place URL"
                    aria-describedby="addon-wrapping"
                    value={scrapingUrl}
                    onChange={e => setScrapingUrl(e.target.value)}
                  />
                </div>
                <button
                  className="btn"
                  type="button"
                  id="addon-wrapping"
                  onClick={() => startScraping(scrapingUrl)}
                  disabled={!scrapingUrl}
                >
                  Start
                </button>
              </div>
              <div className="col d-flex gap-3 justify-content-center">
                {/* <div className="badge canceled"> */}
                {/* <div className="badge complted"> */}
                <div className="badge on-progress">
                  {/* Canceled */}
                  {/* Success */}
                  <li>On Progress</li>
                </div>
                <div className="badge on-progress bg-transparent">00m 12s</div>
              </div>
              <div className="col d-flex justify-content-end">
                <button className="btn btn-danger">STOP</button>
              </div>
            </div>
            <div className="card border-0 mt-3">
              <div className="card-body">
                <div className="d-flex">
                  <ToggleButtonGroup
                    type="radio"
                    name="options-base"
                    value={selectedValue}
                    onChange={value => setSelectedValue(value)}
                    className="filter"
                  >
                    <ToggleButton
                      id="option5"
                      value="all"
                      variant="outline-primary"
                    >
                      All
                    </ToggleButton>
                    <ToggleButton
                      id="option6"
                      value="completed"
                      variant="outline-primary"
                    >
                      Completed
                    </ToggleButton>
                    <ToggleButton
                      id="option8"
                      value="canceled"
                      variant="outline-primary"
                    >
                      Canceled
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="card border-0">
          <div className="card-body bg-white">
            <table className="table geo-table">
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
                        {review.title.replace(/ - Google Maps/g, "")}
                      </a>
                    </td>
                    <td>{formatTime(review.createdAt)}</td>
                    <td>{renderCount(review)}</td>
                    <td>{spentTime(review.createdAt, review.completedAt)}</td>
                    <td>
                      <div className="d-flex gap-2 geo-select">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option>JSON</option>
                          <option value="1">CSV</option>
                        </select>
                        <button
                          className="btn border"
                          onClick={() => downloadFile(review.url)}
                        >
                          <i className="bi-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  )
}

export default ScrapReviewsView
