import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"

import "../../style/view.css"
import StarRating from "../../components/star-rating"

function ReviewsView() {
  let { place } = useParams()
  const [reviews, setReviews] = useState([] as any[])
  const db = useAppSelector(state => state.firebase.db)

  useEffect(() => {
    if (!db || !place) return
    setReviews([])
    const collectionReviews = collection(db, "reviews", place, "reviews")

    onSnapshot(collectionReviews, querySnapshot => {
      setReviews([])
      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data())
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

  const reviewers = [
    {
      user: "Umid Hamrayev",
      score: 4,
      date: new Date(),
      images: [
        "https://images.pexels.com/photos/157928/young-man-male-handsome-model-attractive-157928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/12125459/pexels-photo-12125459.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/12125459/pexels-photo-12125459.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/12125459/pexels-photo-12125459.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/12125459/pexels-photo-12125459.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/12125459/pexels-photo-12125459.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      ],
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ]

  return (
    <div className="view">
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
                {reviewers.map((e, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td className="view__table-item">{e.user}</td>
                    <td>
                      <StarRating rating={String(e.score)} />
                    </td>
                    <td>
                      {new Date(e.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="view__table-images">
                        {e.images.slice(0, 4).map((imageSrc, imageId) => (
                          <img
                            key={imageId}
                            src={imageSrc}
                            style={{ marginLeft: imageId > 0 ? "-15px" : "0" }}
                          />
                        ))}
                        {e.images.length > 4 && (
                          <div className="view__table-images--extra">
                            +{e.images.length - 4}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="view__table-content">
                      <span>{e.content}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Images</th>
            <th scope="col">Content</th>
          </tr>
        </thead>
        <tbody>
          {reviews &&
            reviews.map((review: any) => {
              return (
                <tr key={review.id}>
                  <th scope="row">{review.id}</th>
                  <td>
                    {review.images &&
                      review.images.map((image: any, index: number) => (
                        <img
                          className="img-thumbnail"
                          width="100"
                          key={index}
                          src={image}
                          alt="review"
                        />
                      ))}
                  </td>
                  <td>{review.reviewText}</td>
                </tr>
              )
            })}
        </tbody>
      </table> */}
    </div>
  )
}

export default ReviewsView
