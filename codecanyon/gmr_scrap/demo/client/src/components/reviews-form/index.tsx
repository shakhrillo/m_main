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
import StarRating from "../star-rating"
import Loader from "../loader"
import { CodeBlock, dracula } from "react-code-blocks"
import { spentTime } from "../../utils/spentTime"
import { formatStats } from "../../utils/formatStats"

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
  const [placeInfoShow, setPlaceInfoShow] = useState(false)
  const [info, setInfo] = useState({
    error: "",
    url: "",
    title: "",
    subtitle: "",
    address: "",
    phone: "",
    website: "",
    rating: 0,
    reviews: "",
    screenshot: "",
    status: "",
    createdAt: new Date(),
    updatedAt: "",
    stats: {},
  })
  const [scrap, setScrap] = useState({
    url: "",
    limit: 30,
    sortBy: "Most relevant",
    extractVideoUrls: false,
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
      const overviewId = await startExtractGmapReviewsOverview(user!.uid, scrap)
      setOverviewId(overviewId)
      localStorage.setItem("overviewId", overviewId)
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setInfo({
        error: "",
        url: scrap.url,
        title: "",
        subtitle: "",
        address: "",
        phone: "",
        website: "",
        rating: 0,
        reviews: "",
        screenshot: "",
        status: "",
        createdAt: new Date(),
        updatedAt: "",
        stats: {},
      })
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
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      doc => {
        if (doc.exists()) {
          const info = doc.data() as any
          if (info.title) {
            localStorage.removeItem("overviewId")
          }
          setInfo(info)
          console.log(info)
          if (!!info.address) {
            setLoading(false)
            setPlaceInfoShow(true)
          }
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
    const unsubscribe = onSnapshot(
      doc(
        firestore,
        `machines/info_${user.uid.toLowerCase()}_${overviewId.toLowerCase()}`,
      ),
      doc => {
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
    return (
      <div className="mt-4 scrap">
        <div>
          <form onSubmit={handleGetInfo}>
            <div className="mb-3">
              <div className="scrap__header">
                <h3>Scrap Reviews</h3>
              </div>
              <div className="my-4 bg-light px-3 py-1 rounded">
                <nav aria-label="breadcrumb m-0">
                  <ol className="breadcrumb m-0">
                    {!placeInfoShow ? (
                      <li className="breadcrumb-item text-muted">
                        <span>URL validation / </span>
                      </li>
                    ) : (
                      <>
                        <li className="breadcrumb-item cursor-pointer">
                          <a
                            className="text-underline  text-muted cursor-pointer"
                            onClick={() => setPlaceInfoShow(false)}
                          >
                            <span>URL validation</span>
                          </a>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          <span>Library</span>
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
              </div>
              <div className="scrap__content__header mt-3">
                <h6>
                  {!placeInfoShow ? "URL validation" : "Place information"}
                </h6>
              </div>
              {!placeInfoShow && (
                <div className="text-start scrap__content">
                  {loading ? (
                    <div className="scrap__content__dim d-flex align-items-center justify-content-center">
                      {info.error ? (
                        <div>
                          <div>
                            <div className="alert alert-danger">
                              <strong>Error:</strong> {info.error} <br />
                              Please try again. Make sure the URL is correct and
                              the place is available on Google Maps.
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setOverviewId("")
                                localStorage.removeItem("overviewId")
                                setPlaceInfoShow(false)
                              }}
                            >
                              Try again
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-center">
                            <Loader />
                            <small className="text-muted">
                              The process may take between 15 to 60 seconds.{" "}
                              <br />
                              If it takes too long, please try again.
                            </small>
                            <small>Spent time: {spentTime(info)}</small>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="mt-3 scrap__content__body">
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
                      className="form-control col"
                    />
                    <div className="form-text" id="urlHelp">
                      Example URL: https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8
                    </div>
                    <button
                      className="btn btn-primary col-2 mt-3"
                      type="submit"
                      disabled={loading || !isUrlValid}
                    >
                      Validate URL
                    </button>
                  </div>
                </div>
              )}
              {placeInfoShow && (
                <div>
                  <div className="mt-3">
                    <div className="">
                      <h2>{info.title}</h2>
                      <p className="card-text text-muted">{info.address}</p>
                      <small>
                        <a href={info.url} target="_blank" rel="noreferrer">
                          {info.url}
                        </a>
                      </small>
                      <form onSubmit={handleStartScraping}>
                        <div className="d-flex mt-5 gap-4">
                          <div className="mb-3 card p-3 w-50">
                            <label htmlFor="limit" className="form-label">
                              Limit
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              id="limit"
                              value={scrap.limit}
                              onChange={e =>
                                handleInputChange(
                                  "limit",
                                  Number(e.target.value),
                                )
                              }
                            />
                            <div className="form-text" id="limitHelp">
                              Available reviews:{" "}
                              {(info.reviews || "0").toLocaleString()} <br />
                              Maximum reviews that can be scraped depends on the
                              Machine's memory
                            </div>
                          </div>

                          <div className="mb-3 card p-3 w-50">
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
                              By default, reviews are sorted by relevance. And
                              the number of reviews is limited to less than
                              1000.
                            </div>
                          </div>
                        </div>

                        <div className="mb-3 mt-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="extractImageUrls"
                              checked={scrap.extractImageUrls}
                              onChange={() =>
                                handleCheckboxChange("extractImageUrls")
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="extractImageUrls"
                            >
                              Extract image URLs
                            </label>
                            <div
                              className="form-text"
                              id="extractImageUrlsHelp"
                            >
                              Extract image URLs from reviews.
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="extractVideoUrls"
                              checked={scrap.extractVideoUrls}
                              onChange={() =>
                                handleCheckboxChange("extractVideoUrls")
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="extractVideoUrls"
                            >
                              Extract video URLs
                            </label>
                            <div
                              className="form-text"
                              id="extractVideoUrlsHelp"
                            >
                              Extract video URLs from reviews.
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ownerResponse"
                              checked={scrap.ownerResponse}
                              onChange={() =>
                                handleCheckboxChange("ownerResponse")
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ownerResponse"
                            >
                              Owner response
                            </label>
                            <div className="form-text" id="ownerResponseHelp">
                              Extract owner responses to reviews.
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            className="btn btn-outline-danger me-3"
                            onClick={() => setPlaceInfoShow(false)}
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
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
  return (
    <div>
      {/* <div className="progress mt-3 px-2">
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
      </div> */}
      {renderStepContent()}
    </div>
  )
}
