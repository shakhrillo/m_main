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
  const [step, setStep] = useState(0)
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
      setStep(0)
      // setLoading(false)
    } finally {
      // setStep(1)
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
      setStep(0)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      doc => {
        // setLoading(false)
        if (doc.exists()) {
          const info = doc.data() as any
          if (info.title) {
            localStorage.removeItem("overviewId")
          }
          setInfo(info)
          console.log(info)
          if (!!info.address) {
            setLoading(false)
            setStep(1)
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
    switch (step) {
      case 0:
        return (
          <div className="mt-4 scrap">
            <div className="container">
              <form onSubmit={handleGetInfo}>
                <div className="mb-3 text-center">
                  <div className="scrap__header">
                    <h3>Scrap Reviews</h3>
                    <span className="text-muted">
                      For scraping complate this steps
                    </span>
                  </div>
                  <div className="d-flex justify-content-center gap-5 my-5 scrap__steps">
                    <div className="border border-primary d-flex gap-2 justify-content-center align-items-center scrap__steps__item">
                      <div className="border border-primary d-flex align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                        1
                      </div>
                      <span>URL validation</span>
                    </div>
                    <div className="d-flex gap-2 justify-content-center align-items-center border scrap__steps__item">
                      <div className="border d-flex text-muted align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                        2
                      </div>
                      <span className="text-muted">Information</span>
                    </div>
                    <div className="d-flex gap-2 justify-content-center align-items-center border scrap__steps__item">
                      <div className="border d-flex text-muted align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                        3
                      </div>
                      <span className="text-muted">Result</span>
                    </div>
                  </div>

                  <div className="text-start scrap__content">
                    {
                      // !info.title ||
                      loading ? (
                        <div className="scrap__content__dim d-flex align-items-center justify-content-center">
                          {info.error ? (
                            <div>
                              <div>
                                <div className="alert alert-danger">
                                  <strong>Error:</strong> {info.error} <br />
                                  Please try again. Make sure the URL is correct
                                  and the place is available on Google Maps.
                                </div>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    setOverviewId("")
                                    localStorage.removeItem("overviewId")
                                    setStep(0)
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
                      )
                    }
                    <div className="scrap__content__header">
                      <p className="m-0 text-muted">Step 1</p>
                      <h6>URL validation</h6>
                    </div>
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
                </div>
              </form>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="text-center">
            {/* {!info.title || loading ? (
              info.error ? (
                <div className="card">
                  <div className="card-body">
                    <div className="alert alert-danger">
                      <strong>Error:</strong> {info.error} <br />
                      Please try again. Make sure the URL is correct and the
                      place is available on Google Maps.
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setOverviewId("")
                        localStorage.removeItem("overviewId")
                        setStep(0)
                      }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center">
                    <Loader />
                    <small className="text-muted">
                      The process may take between 15 to 60 seconds. <br />
                      If it takes too long, please try again.
                    </small>
                    <small>Spent time: {spentTime(info)}</small>
                  </div>
                </div>
              )
            ) : ( */}
            <div className="scrap__header">
              <h3>Scrap Reviews</h3>
              <span className="text-muted">
                For scraping complate this steps
              </span>
            </div>
            <div className="d-flex justify-content-center gap-5 my-5 scrap__steps">
              <div className="border border-primary d-flex gap-2 justify-content-center align-items-center scrap__steps__item">
                <div className="border border-primary d-flex align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                  1
                </div>
                <span>URL validation</span>
              </div>
              <div className="border border-primary d-flex gap-2 justify-content-center align-items-center scrap__steps__item second-step">
                <div className="border border-primary d-flex align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                  2
                </div>
                <span>Information</span>
              </div>
              <div className="d-flex gap-2 justify-content-center align-items-center border scrap__steps__item">
                <div className="border d-flex text-muted align-items-center justify-content-center rounded-circle scrap__steps__item__number">
                  3
                </div>
                <span className="text-muted">Result</span>
              </div>
            </div>
            <div className="d-flex mt-5 text-start w-100">
              <div className="d-flex-column w-100 h-10">
                <div className="">
                  <div className="row g-0">
                    <div>
                      <div
                        style={{
                          height: 200,
                          backgroundImage: `url(${info.screenshot})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          borderRadius: 10,
                        }}
                      ></div>
                    </div>
                    <div>
                      <div className="card-body d-flex flex-column h-100 mt-4">
                        <h2>{info.title}</h2>
                        <p className="card-text text-muted">{info.address}</p>
                        <ul className="row list-unstyled mt-auto single-review__info">
                          {/* <li className="col-2 d-flex flex-column border-end px-4">
                              <p>Status</p>
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                {statusRender(info.status, { width: 50, height: 50 })}
                              </div>
                            </li> */}
                          <li className="col d-flex flex-column border-end px-3">
                            <p>Average Rating</p>
                            <div className="d-flex gap-2 align-items-center my-2">
                              <h2 className="m-0">
                                {info.rating ? info.rating : "N/A"}
                              </h2>
                              <StarRating rating={info.rating} size={18} />
                            </div>
                            <span className="text-muted single-review__info__subtitle">
                              Avarage rating for this place
                            </span>
                          </li>
                          <li className="col d-flex flex-column border-end px-3">
                            <p>Reviews</p>
                            <div className="d-flex gap-2 align-items-center">
                              <h2 className="m-0 my-2">{info.reviews || 0}</h2>
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
                          <li className="col d-flex flex-column px-3">
                            <p>Expected time</p>
                            <div className="d-flex gap-2 align-items-center my-2">
                              <h2 className="m-0">
                                +{" "}
                                {Math.ceil(
                                  (parseInt(info.reviews || "0") * 3) / 60,
                                ).toLocaleString()}{" "}
                                min
                              </h2>
                            </div>
                            <span className="text-muted single-review__info__subtitle">
                              Spended time for this question
                            </span>
                          </li>
                        </ul>
                        <div className="flex-row mt-5">
                          <button
                            className="btn btn-outline-danger me-2"
                            onClick={() => setStep(0)}
                            disabled={loading || !info.title}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary ms-auto"
                            onClick={() => setStep(2)}
                            disabled={loading || !info.title || !info.reviews}
                          >
                            Confirm
                          </button>
                        </div>
                        {/* <div className="alert alert-info mt-3">
                            Spent time: {spentTime(info)}
                          </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        )
      case 2:
        return (
          <div>
            <div className="mt-5">
              <div className="">
                <h2>{info.title}</h2>
                <p className="card-text text-muted">{info.address}</p>
                <small>
                  <a href={info.url} target="_blank" rel="noreferrer">
                    {info.url}
                  </a>
                </small>
                {/* <h5 className="card-title">{info.title}</h5> */}
                {/* <p className="card-text text-muted">
                  {info.address}
                  <br />
                </p> */}
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
                        // disabled={true}
                        onChange={e =>
                          handleInputChange("limit", Number(e.target.value))
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
                        By default, reviews are sorted by relevance. And the
                        number of reviews is limited to less than 1000.
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
                      <div className="form-text" id="extractImageUrlsHelp">
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
                      <div className="form-text" id="extractVideoUrlsHelp">
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
                        onChange={() => handleCheckboxChange("ownerResponse")}
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
