import { useEffect, useState } from "react"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { doc, onSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import loadIcon from "../../assets/icons/loader-2.svg"
import StarRating from "../star-rating"

const steps = [
  {
    title: "Validate URL",
    description: "Enter the URL to scrape reviews from.",
  },
  {
    title: "Review scraping",
    description: "Review scraping is in progress. Please wait.",
  },
  {
    title: "Start scraping",
    description: "Scraping completed. You can now download the reviews.",
  },
]

export const ReviewsForm = () => {
  const { user, firestore } = useFirebase()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({
    url: "",
    title: "",
    subtitle: "",
    address: "",
    phone: "",
    website: "",
    rating: 0,
    reviews: "",
    screenshot: "",
  })
  const [scrap, setScrap] = useState({
    url: "",
    limit: 30,
    sortBy: "Most relevant",
    extractImageUrls: false,
    ownerResponse: true,
    onlyGoogleReviews: false,
  })
  const [overviewId, setOverviewId] = useState("")

  const handleInputChange = (name: string, value: string | number) =>
    setScrap(prev => ({ ...prev, [name]: value }))

  const handleCheckboxChange = (name: string) =>
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }))

  const handleGetInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      setStep(1)
      const overviewId = await startExtractGmapReviewsOverview(user!.uid, scrap)
      setOverviewId(overviewId)
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
      setStep(0)
      setLoading(false)
    }
  }

  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("res", {
      ...info,
      ...scrap,
    })
    return
    setLoading(true)
    try {
      await startExtractGmapReviews(user!.uid, overviewId, {
        ...info,
        ...scrap,
      })
      navigate(`/reviews/${overviewId}`)
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
      setStep(0)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      doc => {
        setLoading(false)
        if (doc.exists()) setInfo(doc.data() as typeof info)
      },
    )
    return unsubscribe
  }, [firestore, user, overviewId])

  useEffect(() => {
    function validateUrl(url: string) {
      if (!url) return false
      const regex = new RegExp("^https://maps\\.app\\.goo\\.gl/[\\w-]+$")
      return regex.test(url)
    }

    setIsUrlValid(validateUrl(scrap.url))
  }, [scrap.url])

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="d-flex-column">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleGetInfo}>
                  <div className="form-wrap">
                    <label htmlFor="url" className="form-label">
                      URL <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="url"
                      value={scrap.url}
                      onChange={e => handleInputChange("url", e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      disabled={loading}
                      className="form-input form-input-lg"
                    />
                    <div className="form-hint">
                      Example URL: https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8
                    </div>
                  </div>
                  <button
                    className="button button-lg button-primary"
                    type="submit"
                    disabled={loading || !isUrlValid}
                  >
                    Validate URL
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            {!info.title || loading ? (
              <>
                <div className="card my-5">
                  <div className="card-body d-flex justify-content-center">
                    <img src={loadIcon} alt="" width={70} />
                  </div>
                </div>
                <p>
                  The process may take between 15 to 60 seconds. If it takes too
                  long, please try again.
                </p>
              </>
            ) : (
              <div className="d-flex">
                <div className="d-flex-column w-100">
                  <div className="card">
                    <div className="card-header d-flex-column">
                      <h3>{info.title}</h3>
                      <p>{info.address}</p>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled m-0 p-0 d-flex">
                        <li className="d-flex-column align-items-center justify-space-around p-5 border-right">
                          <h2 className="my-0">{info.reviews}</h2>
                          <p className="m-0">All reviews</p>
                        </li>
                        <li className="d-flex-column align-items-center justify-space-around p-5">
                          <h2 className="my-0">
                            + {Math.ceil((parseInt(info.reviews) * 3) / 60)} min
                          </h2>
                          <p className="m-0">Expected time</p>
                        </li>
                      </ul>
                    </div>
                    <div className="card-footer d-flex-column gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <StarRating rating={info.rating} />
                        <strong>{info.rating ? info.rating : "N/A"}</strong>
                        <small>Average user rating</small>
                      </div>
                      <div className="d-flex gap-3">
                        <button
                          className="button button-lg"
                          onClick={() => setStep(0)}
                          disabled={loading || !info.title}
                        >
                          Cancel
                        </button>
                        <button
                          className="button button-primary button-lg"
                          onClick={() => setStep(2)}
                          disabled={loading || !info.title}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto"
                  >
                    <div
                      className="img-glass-left"
                      style={{ backgroundImage: `url(${info.screenshot})` }}
                    ></div>
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div>
            <div className="card">
              <div className="card-header">
                <h3>{info.title}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleStartScraping}>
                  <div className="form-wrap">
                    <label htmlFor="limit" className="form-label">
                      Limit
                      <span className="required">*</span>
                    </label>
                    <input
                      className="form-input form-input-lg"
                      type="number"
                      id="limit"
                      value={scrap.limit}
                      // disabled={true}
                      onChange={e => handleInputChange("limit", e.target.value)}
                    />
                    <div className="form-hint">
                      Maximum number of reviews to scrape (30 ~ 3000){" "}
                      <strong>Demo limit is 30</strong>
                    </div>
                  </div>

                  <div className="form-wrap">
                    <label htmlFor="sortBy" className="form-label">
                      Sort by
                    </label>
                    <select
                      disabled={loading}
                      id="sortBy"
                      value={scrap.sortBy}
                      onChange={e =>
                        handleInputChange("sortBy", e.target.value)
                      }
                      className="form-select form-select-lg"
                    >
                      {[
                        "Most relevant",
                        "Newest",
                        "Lowest rating",
                        "Highest rating",
                      ].map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      className="button button-lg"
                      onClick={() => setStep(0)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="button button-lg button-primary"
                      type="submit"
                      disabled={loading}
                    >
                      Start Scraping ({scrap.limit} coins)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="progress">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`progress__step ${i === step ? "active" : ""}`}
            // className={`progress__step ${i === step ? "active" : ""} ${i > step ? "disabled" : ""}`}
            onClick={() => setStep(i)}
          >
            <div className="progress__text">{s.title}</div>
          </div>
        ))}
      </div>
      {renderStepContent()}
    </div>
  )
}
