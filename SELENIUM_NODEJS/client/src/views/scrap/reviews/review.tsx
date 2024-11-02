import { collection, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../app/hooks"
import Pagination from "react-bootstrap/Pagination"
import Button from "react-bootstrap/Button"
import { Modal, Carousel } from "react-bootstrap"

import StarRating from "../../../components/star-rating"
import "../../../style/view.css"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { useFirebase } from "../../../contexts/FirebaseProvider"
import ReviewInfo from "./reviewInfo"

function ScrapReviewsReviewView() {
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
            ...data['textContent'],
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
      { icon: "bi-stars", text: "Score" },
      { icon: "bi-check", text: "Platform" },
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

  const toggleRatingOverview = (id: string) => {
    setRatingOverviewVisibility(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const [showMoreContent, setShowMoreContent] = useState<{
    [key: string]: boolean
  }>({})
  const [showMoreResponse, setShowMoreresponse] = useState<{
    [key: string]: boolean
  }>({})

  const toggleShowMore = (reviewId: string, item: "content" | "response") => {
    if (item === "content") {
      setShowMoreContent(prevState => ({
        ...prevState,
        [reviewId]: !prevState[reviewId],
      }))
    }
    if (item === "response") {
      setShowMoreresponse(prevState => ({
        ...prevState,
        [reviewId]: !prevState[reviewId],
      }))
    }
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
                {currentReviews.map((review, index) => {
                  const isShown = showMoreContent[review.id]
                  const showButton =
                    review.myendText && review.myendText.length > 78
                  return (
                    <tr key={index}>
                      <th scope="row">{indexOfFirstReview + index + 1}</th>
                      <td className="view__table-item">
                        {review.user}
                      </td>
                      <td>
                        {
                          review.rating ?
                            <StarRating rating={
                              parseInt(
                                review.rating.match(/(\d+)/)![0],
                                10,
                              ).toString()
                            } />
                            : "-"
                        }
                      </td>
                      <td>
                        {review.platform}
                      </td>
                      <td>
                        {review.time}
                      </td>
                      <td>
                        <div
                          className="view__table-images"
                          onClick={() => {
                            setSelectedImages(review.imageUrls)
                            handleShow()
                          }}
                        >
                          {review.imageUrls
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
                          {review.imageUrls.length > 4 && (
                            <div className="view__table-images--extra">
                              +{review.imageUrls.length - 4}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="view__table-content">
                        <div className="view__table-content__text">
                          <span className="review-text">
                            {
                              review.qa.length ? (
                                review.qa.map((qa: any, index: number) => (
                                  <div key={index} className="view__table-content__review">
                                    {/* <b>{qa.question}</b>:{" "} */}
                                    <span>
                                      {qa}
                                    </span>
                                    <hr />
                                  </div>
                                ))
                              ) : null
                            }
                          </span>
                          <div className="text-container">
                            <span className={`review-text}`}>
                              {review.myendText.length < 24 ? (
                                review.myendText ? (
                                  review.myendText
                                ) : (
                                  "-"
                                )
                              ) : (
                                <>
                                  {review.myendText.substring(
                                    0,
                                    !showMoreContent[review.id]
                                      ? 24
                                      : review.myendText.length,
                                  ) +
                                    `${!showMoreContent[review.id] ? " ..." : ""}`}
                                  {
                                    <button
                                      onClick={() =>
                                        toggleShowMore(review.id, "content")
                                      }
                                      className="show-more-btn ms-2"
                                    >
                                      {showMoreContent[review.id]
                                        ? "Show less"
                                        : "Show more"}
                                      <i
                                        className={`bi-chevron-down ${showMoreContent[review.id] ? "rotate" : ""}`}
                                      ></i>
                                    </button>
                                  }
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        {/* {Object.keys(review.reviewText.reviewObj).length ||
                        review.reviewText.reviewOverview.length ? (
                          <div className="view__table-content__show-overview">
                            <button
                              onClick={() => toggleRatingOverview(review.id)}
                              className="show-more-btn"
                            >
                              Rating Overview
                              <i
                                className={`bi-chevron-down ${ratingOverviewVisibility[review.id] ? "rotate" : ""}`}
                              ></i>
                            </button>
                          </div>
                        ) : null} */}

                        {/* Display the rating overview based on visibility */}
                        {ratingOverviewVisibility[review.id] && (
                          <div className="card view__table-content__rating-overview">
                            <div className="card-body d-flex row">
                              {Object.keys(review.reviewText.reviewObj)
                                .length ? (
                                <div className="col">
                                  {review.reviewText &&
                                  review.reviewText.reviewObj
                                    ? Object.keys(
                                        review.reviewText.reviewObj,
                                      ).map((key, index) => (
                                        <div
                                          className="view__table-content__review"
                                          key={index}
                                        >
                                          <b>{key}</b>:{" "}
                                          <span>
                                            {review.reviewText.reviewObj[key]}
                                          </span>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              ) : null}
                              {/* {review.reviewText.reviewOverview.length ? (
                                <div className="col">
                                  {review.reviewText.reviewOverview.map(
                                    (overview: string, index: number) => {
                                      const str = overview
                                      const [text, number] = str.split(": ")
                                      return (
                                        <div
                                          className="d-flex gap-2 view__table-content__overview"
                                          key={index}
                                        >
                                          <b>{text}: </b>
                                          <StarRating rating={`${number}`} />
                                        </div>
                                      )
                                    },
                                  )}
                                </div>
                              ) : null} */}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="view__table-content">
                        <span>
                          {review.response.length < 20 ? (
                            review.response ? (
                              review.response
                            ) : (
                              "-"
                            )
                          ) : (
                            <>
                              {review.response.substring(
                                0,
                                !showMoreResponse[review.id]
                                  ? 20
                                  : review.response.length,
                              ) +
                                `${!showMoreResponse[review.id] ? " ..." : ""}`}
                              {
                                <button
                                  onClick={() =>
                                    toggleShowMore(review.id, "response")
                                  }
                                  className="show-more-btn ms-2"
                                >
                                  {showMoreResponse[review.id]
                                    ? "Show less"
                                    : "Show more"}
                                  <i
                                    className={`bi-chevron-down ${showMoreResponse[review.id] ? "rotate" : ""}`}
                                  ></i>
                                </button>
                              }
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="pagination">
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
        </div>
      </div>
    </div>
  )
}

export default ScrapReviewsReviewView
