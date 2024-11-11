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
          <div className="review-form">
            <h1>Which reviews would you like to scrape?</h1>
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

            <form onSubmit={handleGetInfo} className="form">
              <label htmlFor="url">
                URL <span className="required">*</span>
              </label>
              <input
                type="text"
                id="url"
                value={scrap.url}
                onChange={e => handleInputChange("url", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                disabled={loading}
              />
              <div className="form__hint">
                <small>
                  Example URL:{" "}
                  <code style={{ display: "block", marginTop: "0.5rem" }}>
                    https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8
                  </code>
                </small>
              </div>
              <div className="form__actions">
                <button
                  className="primary"
                  type="submit"
                  disabled={loading || !isUrlValid}
                >
                  Validate URL
                </button>
              </div>
            </form>
            <p>
              Each review scraping process may take between 15 to 60 seconds.
            </p>
            <p>
              Reviews are not chargeable. Charges will apply once the scraping
              process begins.
            </p>
          </div>
        )
      case 1:
        return (
          <div className="review-form">
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
                <div
                  className="review-screenshot"
                  style={{ backgroundImage: `url(${info.screenshot})` }}
                ></div>
                <h1>
                  {info.title} ({info.rating})
                </h1>
                <ul>
                  <li>{info.reviews}</li>
                  <li>{info.address}</li>
                  <li>{info.phone}</li>
                  <li>{info.website}</li>
                </ul>
                <form className="form">
                  <div className="form__actions">
                    <button
                      className="secondary"
                      onClick={() => setStep(0)}
                      disabled={loading || !info.title}
                    >
                      Cancel
                    </button>
                    <button
                      className="primary"
                      onClick={() => setStep(2)}
                      disabled={loading || !info.title}
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )
      case 2:
        return (
          <div className="review-form">
            <h1>
              {info.title} ({info.rating})
            </h1>
            <p>
              You can now start scraping reviews. Please select the options
              below.
            </p>
            <form className="form" onSubmit={handleStartScraping}>
              <label htmlFor="limit">
                Limit
                <span className="required">*</span>
              </label>
              <input
                disabled={true}
                type="number"
                id="limit"
                value={scrap.limit}
                onChange={e => handleInputChange("limit", e.target.value)}
              />
              <small className="form__hint">
                Available reviews: {info.reviews}
                <br />
                <strong>Limit</strong> is the number of reviews you would like
                to scrape. The maximum limit is 1000.
              </small>

              <label htmlFor="sortBy">Sort by</label>
              <select
                disabled={loading}
                id="sortBy"
                value={scrap.sortBy}
                onChange={e => handleInputChange("sortBy", e.target.value)}
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

              <label htmlFor="extractImageUrls">
                <input
                  disabled={loading}
                  type="checkbox"
                  checked={scrap.extractImageUrls}
                  onChange={() => handleCheckboxChange("extractImageUrls")}
                />{" "}
                Extract image URLs
              </label>
              <label htmlFor="ownerResponse">
                <input
                  disabled={loading}
                  type="checkbox"
                  checked={scrap.ownerResponse}
                  onChange={() => handleCheckboxChange("ownerResponse")}
                />{" "}
                Owner response
              </label>
              <label htmlFor="onlyGoogleReviews">
                <input
                  disabled={loading}
                  type="checkbox"
                  checked={scrap.onlyGoogleReviews}
                  onChange={() => handleCheckboxChange("onlyGoogleReviews")}
                />{" "}
                Only Google reviews
              </label>

              <div className="form__actions">
                <button
                  className="secondary"
                  onClick={() => setStep(0)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button className="primary" type="submit" disabled={loading}>
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
            className={`progress__step ${i === step ? "active" : ""} ${i > step ? "disabled" : ""}`}
          >
            <div className="progress__text">{s.title}</div>
          </div>
        ))}
      </div>
      {renderStepContent()}
    </div>
  )
}
