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
        <div className="col-md-6">
          <div className="d-flex flex-column h-100 single-review">
            <div className="mt-5">
              <h5 className="single-review__place">{info.title}</h5>
              <p className="card-text text-muted single-review__address">
                {info.address}
              </p>
            </div>
            <ul className="row list-unstyled mt-5">
              {/* <li className="col-2 d-flex flex-column border-end px-4">
                <span className="single-review__info__title">Status</span>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                  {statusRender(info.status, { width: 24, height: 24 })}
                </div>
              </li> */}
              <li className="col d-flex flex-column border-end px-3">
                <span className="single-review__info__title">
                  Average Rating
                </span>
                <div className="d-flex gap-2 align-items-center my-2">
                  <h2 className="m-0">{info.rating ? info.rating : "N/A"}</h2>
                  <StarRating rating={info.rating} size={18} />
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Avarage rating for this place
                </span>
              </li>
              <li className="col d-flex flex-column border-end px-3">
                <span className="single-review__info__title">
                  Extracted Reviews
                </span>
                <div className="d-flex gap-2 align-items-center">
                  <h2 className="m-0 my-2">{info.totalReviews || 0}</h2>
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Count of extracted reviews
                </span>
              </li>
              <li className="col d-flex flex-column border-end px-3">
                <span className="single-review__info__title">Spent time</span>
                <div className="d-flex gap-2 align-items-center my-2">
                  <h2 className="m-0">{spentTime(info)}</h2>
                </div>
                <span className="text-muted single-review__info__subtitle">
                  Spended time for this question
                </span>
              </li>
            </ul>
            <div className="mt-5 single-review__export">
              <h6>Export</h6>
              <div className="border d-inline-flex p-1 w-auto rounded single-review__export__format">
                <button
                  className={`btn btn-sm ${fileFormat === "json" ? "border-secondary" : ""}`}
                  onClick={() => setFileFormat("json")}
                >
                  JSON
                </button>
                <button
                  className={`btn btn-sm ${fileFormat === "csv" ? "border-secondary" : ""}`}
                  onClick={() => setFileFormat("csv")}
                >
                  CSV
                </button>
              </div>
              <button type="button" className="btn btn-secondary ms-3">
                Download
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 border rounded overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.0106964938!2d-74.14483032939027!3d40.69737043291077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNyu-York%20shahri%2C%20Nyu%20York%2C%20Amerika%20Qo%E2%80%98shma%20Shtatlari!5e0!3m2!1suz!2s!4v1734803229954!5m2!1suz!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          {/* <a
            href={info.url}
            target="_blank"
            style={{
              display: "block",
              height: 400,
              backgroundImage: `url(${info.screenshot})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></a> */}
        </div>
      </div>
    </div>
  )
}

export default ReviewInfo
