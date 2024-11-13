import { useEffect, useState } from "react"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { doc, onSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

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
    address: "",
    phone: "",
    website: "",
    rating: "",
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
          <div className="card">
            <div className="card-body">
              <div className="d-flex-column">
                <h3 className="m-0">Which reviews would you like to scrape?</h3>
                <p>
                  Enter the URL of the place from which you would like to scrape
                  reviews, or you can{" "}
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                  >
                    search for a place
                  </a>{" "}
                  on Google Maps and copy the shareable link.
                </p>

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
                      Example URL:
                      <code>https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8</code>
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

                <p>
                  Each review scraping process may take between 15 to 60
                  seconds.
                  <br />
                  Reviews are not chargeable. Charges will apply once the
                  scraping process begins.
                </p>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            {!info.title || loading ? (
              <>
                <h1>Loading...</h1>
                <p>
                  The process may take between 15 to 60 seconds. If it takes too
                  long, please try again.
                </p>
              </>
            ) : (
              <>
                <h1>
                  {info.title} ({info.rating})
                </h1>
                <img src={info.screenshot} alt="" width={250} />
                <ul>
                  <li>{info.reviews}</li>
                  <li>{info.address}</li>
                  {info.phone && <li>{info.phone}</li>}
                  {info.website && <li>{info.website}</li>}
                </ul>
                <div className="d-flex gap-3">
                  <button
                    className="button"
                    onClick={() => setStep(0)}
                    disabled={loading || !info.title}
                  >
                    Cancel
                  </button>
                  <button
                    className="button"
                    onClick={() => setStep(2)}
                    disabled={loading || !info.title}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        )
      case 2:
        return (
          <div>
            <h1>
              {info.title} ({info.rating})
            </h1>
            <p>
              You can now start scraping reviews. Please select the options
              below.
            </p>
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
                  onChange={e => handleInputChange("limit", e.target.value)}
                />
                <div className="form-hint">
                  Available reviews: {info.reviews}
                  <br />
                  <strong>Limit</strong> is the number of reviews you would like
                  to scrape. The maximum limit is 1000.
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
                  onChange={e => handleInputChange("sortBy", e.target.value)}
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

              <div className="form-wrap">
                <label htmlFor="extractImageUrls" className="form-label">
                  <input
                    disabled={loading}
                    type="checkbox"
                    checked={scrap.extractImageUrls}
                    onChange={() => handleCheckboxChange("extractImageUrls")}
                    className="form-checkbox"
                  />{" "}
                  Extract image URLs
                </label>
              </div>

              <div className="form-wrap">
                <label htmlFor="ownerResponse" className="form-label">
                  <input
                    disabled={loading}
                    type="checkbox"
                    checked={scrap.ownerResponse}
                    onChange={() => handleCheckboxChange("ownerResponse")}
                    className="form-checkbox"
                  />{" "}
                  Owner response
                </label>
              </div>

              <div className="form-wrap">
                <label htmlFor="onlyGoogleReviews" className="form-label">
                  <input
                    disabled={loading}
                    type="checkbox"
                    checked={scrap.onlyGoogleReviews}
                    onChange={() => handleCheckboxChange("onlyGoogleReviews")}
                    className="form-checkbox"
                  />{" "}
                  Only Google reviews
                </label>
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
                  Start Scraping
                </button>
              </div>
            </form>
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
