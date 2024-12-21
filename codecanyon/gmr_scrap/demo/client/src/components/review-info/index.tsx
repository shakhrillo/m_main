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
    <div className="card">
      <div className="row g-0">
        <div className="col-md-6">
          <div className="card-body d-flex flex-column h-100">
            <h5 className="card-title">{info.title}</h5>
            <p className="card-text text-muted">{info.address}</p>
            <div className="d-flex align-items-center gap-3">
              <StarRating rating={info.rating} />
              <strong>{info.rating ? info.rating : "N/A"}</strong>
              <small>Average user rating</small>
            </div>
            <ul className="list-group list-group-horizontal mt-auto mb-3">
              <li className="list-group-item d-flex align-items-center">
                {statusRender(info.status, { width: 48, height: 48 })}
              </li>
              <li className="list-group-item">
                <h2 className="display-5">{info.totalReviews || 0}</h2>
                <span>Extracted reviews</span>
              </li>
              <li className="list-group-item">
                <h2 className="display-5">{spentTime(info)}</h2>
                <span>Spent time</span>
              </li>
            </ul>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download as CSV
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
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
