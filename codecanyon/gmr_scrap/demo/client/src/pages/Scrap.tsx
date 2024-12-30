import React, { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../services/firebaseService"
import { doc, onSnapshot } from "firebase/firestore"

const Scrap = () => {
  const { user, firestore } = useFirebase()
  const navigate = useNavigate()

  // State managment
  const [loading, setLoading] = useState(false)
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [placeInfoShow, setPlaceInfoShow] = useState(false)
  const [pendingMessages, setPendingMessages] = useState([])
  const [overviewId, setOverviewId] = useState(
    localStorage.getItem("overviewId") || "",
  )
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

  // Handlers for input changes
  const handleInputChange = useCallback(
    (name: string, value: string | number) =>
      setScrap(prev => ({ ...prev, [name]: value })),
    [],
  )

  const handleCheckboxChange = (name: string) =>
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }))

  // Function to fetch information overview
  const handleGetInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const newOverviewId = await startExtractGmapReviewsOverview(
        user!.uid,
        scrap,
      )
      setOverviewId(newOverviewId)
      localStorage.setItem("overviewId", newOverviewId)
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
      setLoading(false)
    }
  }

  // Function to start scraping reviews
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
    } finally {
      setLoading(false)
    }
  }

  // Validate URL format
  useEffect(() => {
    const validateUrl = (url: string) => {
      if (!url) return false
      const regex = /^https:\/\/maps\.app\.goo\.gl\/[\w-]+$/
      return regex.test(url)
    }

    setIsUrlValid(validateUrl(scrap.url))
  }, [scrap.url])

  // Firestore snapshot listner for review overview
  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      doc => {
        if (doc.exists()) {
          const data = doc.data() as any
          setInfo(data)
          if (data.title) {
            localStorage.removeItem("overviewId")
          }
          if (data.address) {
            setPlaceInfoShow(true)
            setLoading(false)
          }
          if (data.error) {
            setScrap(prev => ({ ...prev, url: "" }))
            setLoading(false)
          }
        }
      },
    )
    return unsubscribe
  }, [firestore, user, overviewId])

  // Firestore snapshot listner for pending messages
  useEffect(() => {
    if (!firestore || !user || !overviewId) return
    const unsubscribe = onSnapshot(
      doc(
        firestore,
        `machines/info_${user.uid.toLowerCase()}_${overviewId.toLowerCase()}`,
      ),
      doc => {
        setPendingMessages([...pendingMessages, { ...doc.data() }] as any)
      },
    )
    return unsubscribe
  }, [firestore, user, overviewId])

  // Form configuration for checkboxes
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

      {/* URL validation form */}
      {!placeInfoShow ? (
        <div className="mt-3">
          <label htmlFor="url" className="form-label">
            URL <span className="required">*</span>
          </label>
          <input
            type="text"
            id="url"
            value={scrap.url}
            onChange={e => handleInputChange("url", e.target.value)} // Handle URL input change
            placeholder="https://maps.app.goo.gl/..."
            disabled={loading} // Disable input while loading
            className="form-control col"
          />
          <div className="form-text" id="urlHelp">
            Example URL: https://maps.app.goo.gl/uk3pia9UCuxTYJ2r8
          </div>
          <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={loading || !isUrlValid} // Disable button if loading or URL is invalid
          >
            {loading ? "Loading..." : "Validate URL"}
          </button>

          {/* Show error if validation fails */}
          {info.error && (
            <div className="mt-3 alert alert-danger">
              <strong>Error:</strong> {info.error} <br />
              Please try again. Make sure the URL is correct and the place is
              available on Google Maps.
            </div>
          )}
        </div>
      ) : (
        /* Display place information if URL validation is successful */
        <div className="mt-3">
          <h2>{info.title}</h2>
          <p className="card-text text-muted">{info.address}</p>

          {/* Show map screenshot and link to place */}
          <a href={info.url} target="_blank" rel="noopener noreferrer">
            <img src={info.screenshot} alt="Place Map" height={320} />
          </a>

          {/* Review limit and sorting options */}
          <div className="d-flex mt-5 gap-4">
            <div className="mb-3 card p-3 w-50">
              <label htmlFor="limit" className="form-label">
                Limit
              </label>
              <input
                type="number"
                id="limit"
                value={scrap.limit}
                onChange={
                  e => handleInputChange("limit", Number(e.target.value)) // Update limit value
                }
                className="form-control"
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
                id="sortBy"
                value={scrap.sortBy}
                onChange={e => handleInputChange("sortBy", e.target.value)} // Update sorting option
                className="form-select"
                disabled={loading} // Disable select while loading
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

          {/* Checkbox options for additional features */}
          <div className="mt-4">
            {formCheckContent.map(e => (
              <div className="mb-3" key={e.textId}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id={e.id}
                    checked={e.checked}
                    onChange={e.onChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={e.htmlFor}>
                    {e.label}
                  </label>
                  <div className="form-text" id={e.textId}>
                    {e.text} {/* Display text for checkbox */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-4">
            <button
              className="btn btn-outline-danger me-3"
              onClick={() => setPlaceInfoShow(false)} // Cancel and go back to URL validation
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary ms-auto"
              type="submit"
              onClick={handleStartScraping} // Start craping reviews
              disabled={loading}
            >
              Start Scraping ({scrap.limit} coins)
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

export default Scrap
