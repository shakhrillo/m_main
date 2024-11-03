import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"

import { NavLink, Outlet } from "react-router-dom"
import "../../style/dashboard.css"
import logoImg from "../../assets/images/logo.png"
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

  const usFb = useFirebase()

  useEffect(() => {
    console.log("usFb", usFb)
  }, [usFb])

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
      <div className="sidebar card border-0">
        <div className="card-body">
          <NavLink className="navbar-brand" to={"/"}>
            <img src={logoImg} alt="logo" />
          </NavLink>
          <div className="list-group mt-4">
            <NavLink
              className={({ isActive }) =>
                `list-group-item mb ${isActive ? "active" : ""}`
              }
              to="/reviews"
            >
              <i className="bi-search"></i>
              <span>Scrap Reviews</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? "active" : ""}`
              }
              to="/usage"
            >
              <i className="bi-bar-chart"></i>
              <span>Usage</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? "active" : ""}`
              }
              to="/payments"
            >
              <i className="bi-credit-card"></i>
              <span>Payments</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? "active" : ""}`
              }
              to="/reviews"
            >
              <i className="bi-gear"></i>
              <span>Settings</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? "active" : ""}`
              }
              to="/reviews"
            >
              <i className="bi-question-circle"></i>
              <span>Help</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `list-group-item list-group-item-action mt-auto border-top ${isActive ? "active" : ""}`
              }
              to="/reviews"
            >
              <i className="bi-box-arrow-left"></i>
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardView
