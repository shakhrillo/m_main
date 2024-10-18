import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import Pagination from "react-bootstrap/Pagination"
import Button from "react-bootstrap/Button"
import { Modal, Carousel } from "react-bootstrap"

import StarRating from "../../components/star-rating"
import "../../style/view.css"

function ReviewsView() {
  let { place } = useParams()
  const [selectedImages, setSelectedImages] = useState([] as any[])
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(15) // Number of reviews per page
  const db = useAppSelector(state => state.firebase.db)

  useEffect(() => {
    if (!db || !place) return
    setReviews([])
    const collectionReviews = collection(db, "reviews", place, "reviews")

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
  }, [db, place])

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const table = {
    header: [
      { icon: "", text: "#" },
      { icon: "bi-person", text: "User" },
      { icon: "bi-stars", text: "Score" },
      { icon: "bi-clock", text: "Date" },
      { icon: "bi-image", text: "Images" },
      { icon: "bi-chat-square-text", text: "Content" },
    ],
  }

  return (
    <div className="view">
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="view__all-images__carousel-title">
            All images
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel interval={null}>
            {selectedImages.map((imageSrc: string, imageId: number) => (
              <Carousel.Item key={imageId}>
                <div className="view__all-images__carousel-item">
                  <img src={imageSrc} alt={`Slide ${imageId}`} />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            All images
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            selectedImages.map((imageSrc: string, imageId: number) => (
              <img
                key={imageId}
                src={imageSrc}
                style={{ width: "100%", marginBottom: "15px" }}
              />
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
      <div className="container">
        <div className="card">
          <div className="card-body">
            <table className="table view__table">
              <thead>
                <tr>
                  {table.header.map((e, inde) => (
                    <th scope="col" key={inde}>
                      <i className={e.icon} />
                      {e.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review, index) => (
                  <tr key={index}>
                    <th scope="row">{indexOfFirstReview + index + 1}</th>
                    <td className="view__table-item">{review.reviewer.name}</td>
                    <td>
                      <StarRating rating={String(review.score)} />
                    </td>
                    <td>{new Date(review.date).toLocaleDateString()}</td>
                    <td>
                      <div
                        className="view__table-images"
                        onClick={() => {
                          setSelectedImages(review.images)
                          handleShow()
                        }}
                      >
                        {review.images
                          .slice(0, 4)
                          .map((imageSrc: string, imageId: number) => (
                            <img
                              key={imageId}
                              src={imageSrc}
                              style={{
                                marginLeft: imageId > 0 ? "-15px" : "0",
                              }}
                            />
                          ))}
                        {review.images.length > 4 && (
                          <div className="view__table-images--extra">
                            +{review.images.length - 4}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="view__table-content">
                      <span>{review.reviewText}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <Pagination>
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={currentPage === i + 1}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsView
