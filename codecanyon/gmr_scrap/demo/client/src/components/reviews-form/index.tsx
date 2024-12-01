import { useEffect, useState } from "react"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService"
import { useFirebase } from "../../contexts/FirebaseProvider"
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
// import loadIcon from "../../assets/icons/loader-2.svg"
import StarRating from "../star-rating"
import Loader from "../loader"
import { CodeBlock, dracula } from "react-code-blocks"

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
  const [overviewId, setOverviewId] = useState(
    localStorage.getItem("overviewId") || "",
  )
  const [pendingMessages, setPendingMessages] = useState([])

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
      localStorage.setItem("overviewId", overviewId)
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
        if (doc.exists()) {
          const info = doc.data() as any
          if (info.title) {
            console.log("rm", info)
            localStorage.removeItem("overviewId")
          }
          setInfo(info)
        }
      },
    )
    return unsubscribe
  }, [firestore, user, overviewId])

  // useEffect(() => {
  //   if (!firestore || !user || !overviewId) return
  //   setPendingMessages([])
  //   const collectionRef = query(
  //     collection(
  //       firestore,
  //       `users/${user.uid}/reviewOverview/${overviewId}/status`,
  //     ),
  //     orderBy("createdAt", "desc"),
  //     limit(15),
  //   )
  //   const unsubscribe = onSnapshot(collectionRef, snapshot => {
  //     const messages = snapshot.docs.map(doc => doc.data())
  //     console.log("messages", messages)
  //     setPendingMessages(messages as any)
  //   })

  //   return unsubscribe
  // }, [firestore, user, overviewId])

  // userId, reviewId,
  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    console.log("____", `machines/info_${user.uid}_${overviewId}`)
    const unsubscribe = onSnapshot(
      doc(
        firestore,
        `machines/info_${user.uid.toLowerCase()}_${overviewId.toLowerCase()}`,
      ),
      doc => {
        console.log("doc>>", doc.data())
        setPendingMessages([
          ...pendingMessages,
          {
            ...doc.data(),
          },
        ] as any)
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
              <form onSubmit={handleGetInfo}>
                <div className="mb-3">
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
                    className="form-control"
                  />
                  <div className="form-text" id="urlHelp">
                    Example URL: https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading || !isUrlValid}
                >
                  Validate URL
                </button>
              </form>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            {!info.title || loading ? (
              <>
                <div className="card">
                  <div className="card-body text-center">
                    <Loader />
                    <small className="text-muted">
                      The process may take between 15 to 60 seconds. <br />
                      If it takes too long, please try again.
                    </small>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex">
                <div className="d-flex-column w-100">
                  <div className="card">
                    <div className="row g-0">
                      <div className="col-md-5">
                        <div className="card-body d-flex flex-column h-100">
                          <h5 className="card-title">{info.title}</h5>
                          <p className="card-text text-muted">{info.address}</p>
                          <div className="d-flex align-items-center gap-3">
                            <StarRating rating={info.rating} />
                            <strong>{info.rating ? info.rating : "N/A"}</strong>
                            <small>Average user rating</small>
                          </div>
                          <ul className="list-unstyled d-flex gap-5 mt-auto">
                            <li>
                              <h3 className="my-0">
                                {info.reviews.toLocaleString()}
                              </h3>
                              <p>Reviews</p>
                            </li>
                            <li>
                              <h3 className="my-0">
                                +{" "}
                                {Math.ceil(
                                  (parseInt(info.reviews) * 3) / 60,
                                ).toLocaleString()}{" "}
                                min
                              </h3>
                              <p>Expected time</p>
                            </li>
                          </ul>
                          <div className="d-flex">
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => setStep(0)}
                              disabled={loading || !info.title}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary ms-auto"
                              onClick={() => setStep(2)}
                              disabled={loading || !info.title}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <img
                          src={info.screenshot}
                          alt="screenshot"
                          className="img-fluid rounded-end"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{info.title}</h5>
                <p className="card-text text-muted">
                  {info.address}
                  <br />
                  <small>
                    <a href={info.url} target="_blank" rel="noreferrer">
                      {info.url}
                    </a>
                  </small>
                </p>
                <form onSubmit={handleStartScraping}>
                  <div className="mb-3">
                    <label htmlFor="limit" className="form-label">
                      Limit
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="limit"
                      value={scrap.limit}
                      // disabled={true}
                      onChange={e =>
                        handleInputChange("limit", Number(e.target.value))
                      }
                    />
                    <div className="form-text" id="limitHelp">
                      Available reviews: {info.reviews.toLocaleString()} <br />
                      Maximum reviews that can be scraped depends on the
                      Machine's memory
                    </div>
                  </div>

                  <div className="mb-3">
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
                      className="form-select"
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
                    <div className="form-text" id="sortByHelp">
                      By default, reviews are sorted by relevance. And the
                      number of reviews is limited to less than 1000.
                    </div>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setStep(0)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary ms-auto"
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
