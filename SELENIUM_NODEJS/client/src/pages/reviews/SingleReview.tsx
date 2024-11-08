import { collection, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Carousel, Modal } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Pagination from "react-bootstrap/Pagination"
import { useParams } from "react-router-dom"

import { getDownloadURL, getStorage, ref } from "firebase/storage"
import ReviewInfo from "../../components/ReviewInfo"
import StarRating from "../../components/star-rating"
import { useFirebase } from "../../contexts/FirebaseProvider"

function SingleReview() {
  let { place } = useParams()
  const [selectedImages, setSelectedImages] = useState([] as any[])
  const [show, setShow] = useState(false)
  const [placeInfo, setPlaceInfo] = useState({} as any)

  const [reviewToggle, setReviewToggle] = useState(false)
  const [replayToggle, setReplayToggle] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { firestore, user } = useFirebase()

  const [reviews, setReviews] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(15) // Number of reviews per page

  useEffect(() => {
    if (!firestore || !place || !user) return
    setReviews([])

    const collectionReviewInfo = doc(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
    )

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

    const collectionReviews = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "reviews",
    )

    const unsubscribe = onSnapshot(collectionReviews, querySnapshot => {
      setReviews([])
      querySnapshot.forEach(doc => {
        const data = doc.data()
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
    <>
      <div className="single-review">
        <div className="single-review__wrapper">
          <div className="single-review__wrapper__header">
            <ReviewInfo />
          </div>
          {
            reviews.map((review: any, index: number) => (
              <div className="single-review__wrapper__body">
                <div className="single-review__wrapper__body__item">
                  <div className="single-review__wrapper__body__item__header">
                    <span className="single-review__wrapper__body__item__header__icon">
                      <i className="bi bi-person"></i>
                    </span>
                    <div className="single-review__wrapper__body__item__header__user">
                      <a
                        className="single-review__wrapper__body__item__header__user__name"
                        // href={}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {review.user.name || "Anonymous"}
                      </a>
                      <span className="single-review__wrapper__body__item__header__user__reviews">
                        {review.user.info.length ? review.user.info[0] : ""}
                      </span>
                    </div>
                    {/* <span className="single-reviews__item__header__info">
        //             {review.user.info?.[2]?.split(" ")[1] || ""} -{" "}
        //             {review.user.info?.[2]?.split(" ")[0] || ""} |{" "}
        //             {review.user.info?.[1]?.split(" ")[1] || ""} -{" "}
        //             {review.user.info?.[1]?.split(" ")[0] || ""}
        //           </span> */}
                  </div>
                  <div className="single-review__wrapper__body__item__rating">
                    <StarRating
                       rating={(review.rating?.match(/(\d+)/)?.[0]
                         ? parseInt(review.rating.match(/(\d+)/)[0], 10)
                         : 0
                       ).toString()}
                    />
                    {"|"}
                    <span>
                      Created at: <b>{review.date}</b>
                    </span>
                  </div>
                  <div className="single-review__wrapper__body__item__content">
                    <div className="single-review__wrapper__body__item__content__header">
                      Review
                      <button
                        onClick={() => setReviewToggle(prev => !prev)}
                        className="btn single-review__wrapper__body__item__content__header__toggle geo-btn-transparent geo-btn-outline"
                      >
                        <i className="bi bi-chevron-down"></i>
                      </button>
                    </div>
                    {reviewToggle && (
                      <span className="single-review__wrapper__body__item__content__body">
                        {review.review || "No review"}
                      </span>
                    )}
                  </div>
                  <div className="single-review__wrapper__body__item__content">
                    <div className="single-review__wrapper__body__item__content__header">
                      Replay
                      <button
                        onClick={() => setReplayToggle(prev => !prev)}
                        className="btn single-review__wrapper__body__item__content__header__toggle geo-btn-transparent geo-btn-outline"
                      >
                        <i className="bi bi-chevron-down"></i>
                      </button>
                    </div>
                    {replayToggle && (
                      <span className="single-review__wrapper__body__item__content__body">
                        {review.response || "No response"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
    // <div>
    //   <Modal show={show} onHide={handleClose} size="lg" centered>
    //     <Modal.Header closeButton>
    //       <Modal.Title className="view__all-images__carousel-title">
    //         All images
    //       </Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <Carousel interval={null}>
    //         {selectedImages.map((imageSrc: string, imageId: number) => (
    //           <Carousel.Item key={imageId}>
    //             <div className="view__all-images__carousel-item">
    //               <img src={imageSrc} alt={`Slide ${imageId}`} className="" />
    //             </div>
    //           </Carousel.Item>
    //         ))}
    //       </Carousel>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>
    //         Close
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    //   <div className="single-reviews">
    //     <ReviewInfo />

    //     {currentReviews.map((review, index) => (
    //       <div className="single-reviews__item" key={index}>
    //         <div className="single-reviews__item__header">
    //           <div className="single-reviews__item__header__user">
    //             <span className="single-reviews__item__header__user__icon">
    //               <i className="bi bi-person"></i>
    //             </span>
    //             <div className="single-reviews__item__header__user__info">
    //               <a
    //                 className="single-reviews__item__header__user__info__name"
    //                 href={review.user.href}
    //                 target="_blank"
    //                 rel="noreferrer"
    //               >
    //                 {review.user.name || "Anonymous"}
    //               </a>
    //               <span className="single-reviews__item__header__user__info__status">
    //                 {review.user.info.length ? review.user.info[0] : ""}
    //               </span>
    //             </div>
    //           </div>
    //           <span className="single-reviews__item__header__info">
    //             {review.user.info?.[2]?.split(" ")[1] || ""} -{" "}
    //             {review.user.info?.[2]?.split(" ")[0] || ""} |{" "}
    //             {review.user.info?.[1]?.split(" ")[1] || ""} -{" "}
    //             {review.user.info?.[1]?.split(" ")[0] || ""}
    //           </span>
    //         </div>
    //         <div className="single-reviews__item__status">
    //           <StarRating
    //             rating={(review.rating?.match(/(\d+)/)?.[0]
    //               ? parseInt(review.rating.match(/(\d+)/)[0], 10)
    //               : 0
    //             ).toString()}
    //           />
    //           {"|"}
    //           <span>
    //             Created at: <b>{review.date}</b>
    //           </span>
    //         </div>
    //         <div>
    //           <p className="single-reviews__item__review">{review.review}</p>
    //           {review.qa.length ? (
    //             <ul className="single-reviews__item__qa">
    //               {review.qa.map((qa: string, index: number) => (
    //                 <li
    //                   className="single-reviews__item__qa__item"
    //                   key={index}
    //                 >
    //                   {" - "}
    //                   {qa}
    //                 </li>
    //               ))}
    //             </ul>
    //           ) : null}
    //         </div>
    //         <div className="single-reviews__item__photos">
    //           {review.imageUrls.length
    //             ? review.imageUrls.map((imageUrl: string, index: number) => (
    //                 <img
    //                   key={index}
    //                   src={imageUrl}
    //                   alt={`Review ${index}`}
    //                   width="100"
    //                   onClick={() => {
    //                     setSelectedImages(review.imageUrls)
    //                     handleShow()
    //                   }}
    //                   className="single-reviews__item__photos__item"
    //                 />
    //               ))
    //             : null}
    //         </div>
    //         {review.response.length ? (
    //           <div>
    //             <hr />
    //             <h6>
    //               <strong>Owner response:</strong>
    //             </h6>
    //             <span>{review.response}</span>
    //             <small>{review.responseTime}</small>
    //           </div>
    //         ) : null}
    //       </div>
    //     ))}

    //     <Pagination>
    //       <Pagination.Prev
    //         onClick={() => paginate(currentPage - 1)}
    //         disabled={currentPage === 1}
    //       />

    //       {/* Show first page and ellipsis if needed */}
    //       <Pagination.Item
    //         active={currentPage === 1}
    //         onClick={() => paginate(1)}
    //       >
    //         1
    //       </Pagination.Item>
    //       {currentPage > 4 && <Pagination.Ellipsis />}

    //       {/* Show pages around the current page */}
    //       {Array.from({ length: 5 }, (_, i) => {
    //         const page = currentPage - 2 + i
    //         if (page > 1 && page < totalPages) {
    //           return (
    //             <Pagination.Item
    //               key={page}
    //               active={currentPage === page}
    //               onClick={() => paginate(page)}
    //             >
    //               {page}
    //             </Pagination.Item>
    //           )
    //         }
    //         return null
    //       })}

    //       {/* Show ellipsis and last page if needed */}
    //       {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
    //       {totalPages > 1 && (
    //         <Pagination.Item
    //           active={currentPage === totalPages}
    //           onClick={() => paginate(totalPages)}
    //         >
    //           {totalPages}
    //         </Pagination.Item>
    //       )}

    //       <Pagination.Next
    //         onClick={() => paginate(currentPage + 1)}
    //         disabled={currentPage === totalPages}
    //       />
    //     </Pagination>
    //   </div>
    // </div>
  )
}

export default SingleReview
