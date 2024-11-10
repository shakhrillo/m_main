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
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({
    url: "",
    title: "",
    address: "",
    phone: "",
    website: "",
    rating: "",
    reviews: "",
  })
  const [scrap, setScrap] = useState({
    url: "https://maps.app.goo.gl/G7Q1P9FRq5PFwg2P7",
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
      const overviewId = await startExtractGmapReviews(user!.uid, {
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

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h3>Review Scraping</h3>
            <p>Enter the URL to scrape reviews from.</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </a>
            <form onSubmit={handleGetInfo}>
              <label htmlFor="url">URL</label>
              <input
                type="text"
                id="url"
                value={scrap.url}
                onChange={e => handleInputChange("url", e.target.value)}
                placeholder="https://www.google.com/maps/place/..."
                disabled={loading}
              />
              <button className="primary" type="submit" disabled={loading}>
                Validate URL
              </button>
            </form>
          </>
        )
      case 1:
        return (
          <>
            {!info.title || loading ? (
              <h3>Loading...</h3>
            ) : (
              <>
                <h3>{info.title}</h3>
                <p>
                  {info.rating} - {info.reviews}
                </p>
                <p>{info.website}</p>
                <p>{info.phone}</p>
                <p>{info.address}</p>
                <button
                  className="primary"
                  onClick={() => setStep(2)}
                  disabled={loading || !info.title}
                >
                  Confirm
                </button>
                <button
                  className="secondary"
                  onClick={() => setStep(0)}
                  disabled={loading || !info.title}
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )
      case 2:
        return (
          <>
            <h3>Configuration</h3>
            <p>Ensure information is correct before starting.</p>
            <form onSubmit={handleStartScraping}>
              <label htmlFor="limit">Limit</label>
              <input
                disabled={loading}
                type="number"
                id="limit"
                value={scrap.limit}
                onChange={e => handleInputChange("limit", e.target.value)}
              />

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

              <button className="primary" type="submit" disabled={loading}>
                Start Scraping
              </button>
              <button
                className="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
            </form>
          </>
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
