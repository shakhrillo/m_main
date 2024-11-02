import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"

import { Outlet } from "react-router-dom"
import "../../style/dashboard.css"
import logoImg from "../../assets/logo.png";
import { useFirebase } from "../../contexts/FirebaseProvider"

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

  const usFb = useFirebase();

  useEffect(() => {
    console.log('usFb', usFb);
  }, [usFb]);

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

  async function deleteReview(id: string) {
    await fetch(`http://localhost:3000/reviews/${id}`, {
      method: "DELETE",
    })
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
    <div className="dashboard">
      <div className="sidebar">
        <a className="navbar-brand p-0" href={'/'}>
          <img src={logoImg} alt="logo" height="60" />
        </a>
        <div className="list-group">
          <a type="button" className="list-group-item list-group-item-action active" href="/reviews">
            <i className="bi-search"></i>
            <span>
              Scrap Reviews
            </span>
          </a>
          <div className="list-group list-group-nested d-none">
            <a href="/dashboard/scrap/reviews" className="list-group-item list-group-item-action">
              Reviews
              <span className="badge bg-warning rounded-pill ms-2">1</span>
            </a>
            <a href="/dashboard/scrap/places" className="list-group-item list-group-item-action">Places</a>
          </div>
          <button type="button" className="list-group-item list-group-item-action">
            <i className="bi-bar-chart"></i>
            <span>
              Usage
            </span>
          </button>
          <button type="button" className="list-group-item list-group-item-action">
            <i className="bi-credit-card"></i>
            <span>
              Subscription
            </span>
          </button>
          <button type="button" className="list-group-item list-group-item-action">
            <i className="bi-gear"></i>
            <span>
              Settings
            </span>
          </button>
          <button type="button" className="list-group-item list-group-item-action">
            <i className="bi-question-circle"></i>
            <span>
              Help
            </span>
          </button>
          <button type="button" className="list-group-item list-group-item-action text-danger mt-auto">
            <i className="bi-box-arrow-right"></i>
            <span>
              Logout
            </span>
          </button>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardView
