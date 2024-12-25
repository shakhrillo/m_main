import { memo, useCallback, useEffect, useState } from "react"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService"
import { useFirebase } from "../../contexts/FirebaseProvider"
import { doc, onSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

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

  const handleInputChange = useCallback(
    (name: string, value: string | number) =>
      setScrap(prev => ({ ...prev, [name]: value })),
    [],
  )

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
          if (info.error) {
            setLoading(false)
            setScrap(prev => ({ ...prev, url: "" }))
          }
        }
      },
    )
    return unsubscribe
  }, [firestore, user, overviewId])

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
  console.log("re-render")
  useEffect(() => {
    function validateUrl(url: string) {
      if (!url) return false
      const regex = new RegExp("^https://maps\\.app\\.goo\\.gl/[\\w-]+$")
      return regex.test(url)
    }

    setIsUrlValid(validateUrl(scrap.url))
  }, [scrap.url])

  const formCheckContent = [
    {
      id: "extractImageUrls",
      checked: scrap.extractImageUrls,
      onChange: () => handleCheckboxChange("extractImageUrls"),
      label: "Extract image URLs",
      htmlFor: "extractImageUrls",
      text: "Extract image URLs from reviews.",
      textId: "extractImageUrlsHelp",
    },
    {
      id: "extractVideoUrls",
      checked: scrap.extractVideoUrls,
      onChange: () => handleCheckboxChange("extractVideoUrls"),
      label: "Extract video URLs",
      htmlFor: "extractVideoUrls",
      text: "Extract video URLs from reviews.",
      textId: "extractVideoUrlsHelp",
    },
    {
      id: "ownerResponse",
      checked: scrap.ownerResponse,
      onChange: () => handleCheckboxChange("ownerResponse"),
      label: "Owner response",
      htmlFor: "ownerResponse",
      text: "Extract owner responses to reviews.",
      textId: "ownerResponseHelp",
    },
  ]

  return (
    <form onSubmit={handleGetInfo}>
      <h3>Scrap Reviews</h3>
      <div className="border-bottom mt-4">
        <h6>{!placeInfoShow ? "URL validation" : "Place information"}</h6>
      </div>
      {!placeInfoShow && (
        <div className="mt-3">
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
            className="btn btn-primary mt-3"
            type="submit"
            disabled={loading || !isUrlValid}
          >
            {loading ? "Loading..." : "Validate URL"}
          </button>
          {info.error && (
            <div className="mt-3">
              <div className="alert alert-danger">
                <strong>Error:</strong> {info.error} <br />
                Please try again. Make sure the URL is correct and the place is
                available on Google Maps.
              </div>
            </div>
          )}
        </div>
      )}
      {placeInfoShow && (
        <div className="mt-3">
          <h2>{info.title}</h2>
          <p className="card-text text-muted">{info.address}</p>
          {/* <small>
            <a href={info.url} target="_blank" rel="noreferrer">
              {info.url}
            </a>
          </small> */}
          <a href={info.url} target="_blank">
            <img
              src={info.screenshot}
              alt="Map of New York"
              // width={"100%"}
              height={320}
            />
          </a>

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
                  handleInputChange("limit", Number(e.target.value))
                }
              />
              <div className="form-text" id="limitHelp">
                Available reviews: {(info.reviews || "0").toLocaleString()}{" "}
                <br />
                Maximum reviews that can be scraped depends on the Machine's
                memory
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
                onChange={e => handleInputChange("sortBy", e.target.value)}
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
                By default, reviews are sorted by relevance. And the number of
                reviews is limited to less than 1000.
              </div>
            </div>
          </div>
          <div className="mt-4">
            {formCheckContent.map(e => (
              <div className="mb-3" key={e.textId}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={e.id}
                    checked={e.checked}
                    onChange={e.onChange}
                  />
                  <label className="form-check-label" htmlFor={e.htmlFor}>
                    {e.label}
                  </label>
                  <div className="form-text" id={e.textId}>
                    {e.text}
                  </div>
                </div>
              </div>
            ))}
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
              onClick={handleStartScraping}
            >
              Start Scraping ({scrap.limit} coins)
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
