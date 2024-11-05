import { collection, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Carousel, Modal } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Pagination from "react-bootstrap/Pagination"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"

import { getDownloadURL, getStorage, ref } from "firebase/storage"
import ReviewInfo from "../../components/ReviewInfo"
import StarRating from "../../components/star-rating"
import { useFirebase } from "../../contexts/FirebaseProvider"

function SingleReview() {
  let { place } = useParams()
  const [selectedImages, setSelectedImages] = useState([] as any[])
  const [show, setShow] = useState(false)
  const [placeInfo, setPlaceInfo] = useState({} as any)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { firestore, user } = useFirebase();

  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(15) // Number of reviews per page
  const db = useAppSelector(state => state.firebase.db)
  // const user = useAppSelector(state => state.auth.user)

  const [ratingOverviewVisibility, setRatingOverviewVisibility] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    if (!firestore || !place || !user) return
    setReviews([])

    const collectionReviewInfo = doc(firestore, "users", user.uid, "reviews", place)

    const unsubscribe = onSnapshot(collectionReviewInfo, doc => {
      if (doc.exists()) {
        console.log("Document data:", doc.data())
        setPlaceInfo({
          ...doc.data(),
          id: doc.id,
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [firestore, user, place])

  useEffect(() => {
    if (!firestore || !place || !user) return
    setReviews([])

    const collectionReviews = collection(firestore, "users", user.uid, "reviews", place, "reviews")

    const unsubscribe = onSnapshot(collectionReviews, querySnapshot => {
      setReviews([])
      querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log("Document data:", data)
        setReviews(prev => [
          ...prev,
          {
            ...data,
            id: doc.id,
          },
        ])
      })
    })
    console.log("Reviews: ", reviews)
    return () => {
      unsubscribe()
    }
  }, [firestore, user, place])

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
      { icon: "bi-clock", text: "Date" },
      { icon: "bi-image", text: "Images" },
      { icon: "bi-chat-square-text", text: "Content" },
      { icon: "bi-chat-text", text: "Response" },
    ],
  }

  const downloadFile = async (url: string) => {
    const storage = getStorage()
    const fileRef = ref(storage, url)
    const fileUrl = await getDownloadURL(fileRef)

    window.open(fileUrl, "_blank")
  }

  async function deleteReview(id: string) {
    await fetch(`http://localhost:3000/reviews/${id}`, {
      method: "DELETE",
    })
  }

  return (
    <div>
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
      <div className="d-flex flex-column gap-3">
        <ReviewInfo />

        {currentReviews.map((review, index) => (
          <div className="card" key={index}>
            <div className="card-body">
              <a href={review.user.href} target="_blank" rel="noreferrer">
                {review.user.name || "Anonymous"}
              </a>
              <div className="d-flex gap-2">
                {review.user.info.length ? (
                  review.user.info.map((info: string, index: number) => (
                    <span key={index}>
                      {info}
                    </span>
                  ))
                ) : null}
              </div>
              <i>
                Created at: {review.date}
              </i>
              <StarRating rating={
                (review.rating?.match(/(\d+)/)?.[0] ? parseInt(review.rating.match(/(\d+)/)[0], 10) : 0).toString()
              } />
              <p>
                {review.review}
              </p>
              {
                review.qa.length ? (
                  <ul>
                    {review.qa.map((qa: string, index: number) => (
                      <li key={index}>
                        {qa}
                      </li>
                    ))}
                  </ul>
                ) : null
              }
              {/* Images review.imageUrls*/}
              <div className="d-flex gap-2">
                {review.imageUrls.length ? (
                  review.imageUrls.map((imageUrl: string, index: number) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Review ${index}`}
                      width="100"
                      onClick={() => {
                        setSelectedImages(review.imageUrls)
                        handleShow()
                      }}
                      className="review__image"
                    />
                  ))
                ) : null}
              </div>
              {
                review.response.length ? (
                  <div>
                    <hr />
                    <h6>
                      <strong>Owner response:</strong>
                    </h6>
                    <span>
                      {review.response}
                    </span>
                    <small>
                      {review.responseTime}
                    </small>
                  </div>
                ) : null
              }
            </div>
          </div>
        ))}

        <Pagination>
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {/* Show first page and ellipsis if needed */}
          <Pagination.Item
            active={currentPage === 1}
            onClick={() => paginate(1)}
          >
            1
          </Pagination.Item>
          {currentPage > 4 && <Pagination.Ellipsis />}

          {/* Show pages around the current page */}
          {Array.from({ length: 5 }, (_, i) => {
            const page = currentPage - 2 + i;
            if (page > 1 && page < totalPages) {
              return (
                <Pagination.Item
                  key={page}
                  active={currentPage === page}
                  onClick={() => paginate(page)}
                >
                  {page}
                </Pagination.Item>
              );
            }
            return null;
          })}

          {/* Show ellipsis and last page if needed */}
          {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
          {totalPages > 1 && (
            <Pagination.Item
              active={currentPage === totalPages}
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
          )}

          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  )
}

export default SingleReview
