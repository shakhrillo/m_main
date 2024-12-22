import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { spentTime } from "../../utils/spentTime"
import { statusRender } from "../../utils/statusRender"
import StarRating from "../star-rating"

function ReviewInfo() {
  const { place } = useParams()
  const { firestore, user } = useFirebase()
  const [info, setPlaceInfo] = useState<any>({})
  const [fileFormat, setFileFormat] = useState("json")

  useEffect(() => {
    if (!firestore || !place || !user) return
    const reviewInfoDoc = doc(firestore, "users", user.uid, "reviews", place)

    const unsubscribe = onSnapshot(reviewInfoDoc, doc => {
      if (doc.exists()) {
        setPlaceInfo({ ...doc.data(), id: doc.id })
      }
    })

    return () => unsubscribe()
  }, [firestore, user, place])

  return (
    <div>
      <div className="row g-0">
        <div className="col-md-7">
          <div className="d-flex flex-column h-100">
            <h2>{info.title}</h2>
            <p className="card-text text-muted">{info.address}</p>
            {/* <button type="button" className="btn btn-primary btn-lg">
              Download
            </button> */}
            <ul className="row list-unstyled mt-auto single-review__info">
              <li className="col-2 d-flex flex-column border-end px-4">
                <p>Status</p>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                  {statusRender(info.status, { width: 50, height: 50 })}
                </div>
              </li>
              <li className="col d-flex flex-column border-end px-3">
                <p>Average Rating</p>
                <div className="d-flex gap-2 align-items-center my-2">
                  <h2 className="m-0">{info.rating ? info.rating : "N/A"}</h2>
                  <StarRating rating={info.rating} size={18} />
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Avarage rating for this place
                </span>
              </li>
              <li className="col d-flex flex-column border-end px-3">
                <p>Extracted Reviews</p>
                <div className="d-flex gap-2 align-items-center">
                  <h2 className="m-0 my-2">{info.totalReviews || 0}</h2>
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Count of extracted reviews
                </span>
              </li>
              <li className="col d-flex flex-column border-end px-3">
                <p>Spent time</p>
                <div className="d-flex gap-2 align-items-center my-2">
                  <h2 className="m-0">{spentTime(info)}</h2>
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Spended time for this question
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-5 rounded">
          <a
            href={info.url}
            target="_blank"
            style={{
              display: "block",
              height: 400,
              backgroundImage: `url(${info.screenshot})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></a>
        </div>
      </div>
    </div>
  )
}

export default ReviewInfo
