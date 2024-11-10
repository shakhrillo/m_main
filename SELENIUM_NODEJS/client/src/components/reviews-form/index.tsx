import { useEffect, useState } from "react"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { doc, onSnapshot } from "firebase/firestore"

const steps = [
  {
    title: "Validate URL",
    description: "Enter the URL of the place you want to scrape reviews from.",
  },
  {
    title: "Review scraping",
    description: "Review scraping is in progress. Please wait.",
  },
  {
    title: "Start scraping",
    description:
      "Review scraping has been completed. You can now download the reviews.",
  },
]

export const ReviewsForm = () => {
  const { user, firestore } = useFirebase()
  const sortByOptions = [
    "Most Relevant",
    "Newest",
    "Lowest rating",
    "Highest rating",
  ]
  const [step, setStep] = useState(0)
  const [info, setInfo] = useState({
    limit: 0,
    sortBy: sortByOptions[0],
    extractImageUrls: false,
    ownerResponse: false,
    onlyGoogleReviews: false,
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
  })
  const [overviewId, setOverviewId] = useState("")

  const handleInputChange = (name: string, value: string | number) => {
    setScrap(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => {
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }))
  }

  const startScraping = async (e: any) => {
    e.preventDefault()
    setStep(1)
    const overviewId = await startExtractGmapReviewsOverview(user!.uid, info)
    setOverviewId(overviewId)
  }

  useEffect(() => {
    if (!firestore || !user || !overviewId) return

    const overviewRef = doc(
      firestore,
      `users/${user.uid}/reviewOverview/${overviewId}`,
    )
    const unsubscribe = onSnapshot(overviewRef, doc => {
      if (doc.exists()) {
        const data = doc.data() as any
        console.log(data)
        setInfo({
          ...info,
        })
      }
    })

    return () => unsubscribe()
  }, [firestore, user, overviewId])

  return (
    <div>
      <div className="progress">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`progress__step ${i === step ? "active" : ""} ${i > step ? "disabled" : ""}`}
            onClick={() => setStep(i)}
          >
            <div className="progress__text">{s.title}</div>
          </div>
        ))}
      </div>
      {step === 0 ? (
        <div>
          <h3>Review Scraping</h3>
          <p>Enter the URL of the place you want to scrape reviews from.</p>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
          <form>
            <label htmlFor="url">URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={scrap.url}
              onChange={e => handleInputChange("url", e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
            />
            <br />
            <button className="primary" onClick={startScraping} type="button">
              Validate URL
            </button>
          </form>
        </div>
      ) : null}
      {step === 1 ? (
        <div>
          <h3>{info.title}</h3>
          <p>
            {info.rating} - {info.reviews}
          </p>
          <p>{info.website}</p>
          <p>{info.phone}</p>
          <p>{info.address}</p>
          <br />
          <button className="primary" onClick={e => setStep(2)} type="button">
            Confirm
          </button>
          <br />
          <button className="secondary" onClick={e => setStep(0)} type="button">
            Cancel
          </button>
        </div>
      ) : null}
      {step === 2 ? (
        <div>
          <h3>Configuration</h3>
          <p>
            Make sure the following information is correct before starting the
            scraping process.
          </p>

          <form>
            <label htmlFor="limit">Limit</label>
            <input
              type="number"
              id="limit"
              name="limit"
              value={info.limit}
              onChange={e => handleInputChange("limit", e.target.value)}
              placeholder="5"
            />

            <label htmlFor="sortBy">Sort by</label>
            <select
              id="sortBy"
              name="sortBy"
              value={info.sortBy}
              onChange={e => handleInputChange("sortBy", e.target.value)}
            >
              {sortByOptions.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label htmlFor="extractImageUrls">Extract image URLs</label>
            <input
              type="checkbox"
              id="extractImageUrls"
              name="extractImageUrls"
              checked={info.extractImageUrls}
              onChange={() => handleCheckboxChange("extractImageUrls")}
            />

            <label htmlFor="ownerResponse">Owner response</label>
            <input
              type="checkbox"
              id="ownerResponse"
              name="ownerResponse"
              checked={info.ownerResponse}
              onChange={() => handleCheckboxChange("ownerResponse")}
            />

            <label htmlFor="onlyGoogleReviews">Only Google reviews</label>
            <input
              type="checkbox"
              id="onlyGoogleReviews"
              name="onlyGoogleReviews"
              checked={info.onlyGoogleReviews}
              onChange={() => handleCheckboxChange("onlyGoogleReviews")}
            />

            <br />

            <button className="primary" onClick={startScraping} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 4v16l13 -8z" />
              </svg>
              Start Scraping
            </button>

            <br />

            <button
              className="secondary"
              onClick={e => setStep(1)}
              type="button"
            >
              Back
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
