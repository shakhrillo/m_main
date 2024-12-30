import React, { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseProvider"
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../services/firebaseService"
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore"
import validateUrl from "../utils/validateUrl"

const Scrap = () => {
  const { user, firestore } = useFirebase()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [overviewId, setOverviewId] = useState("")

  const [info, setInfo] = useState({} as any)
  const [scrap, setScrap] = useState({
    url: "",
    limit: 30,
    sortBy: "Most relevant",
    extractVideoUrls: false,
    extractImageUrls: false,
    ownerResponse: true,
  })
  const [selectedTariff, setSelectedTariff] = useState("default")

  const handleTariffChange = (event: any) => {
    setSelectedTariff(event.target.value)
  }

  // Handlers for input changes
  const handleInputChange = useCallback(
    (name: string, value: string | number) =>
      setScrap(prev => ({ ...prev, [name]: value })),
    [],
  )

  const handleCheckboxChange = (name: string) =>
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }))

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

  useEffect(() => {
    if (!firestore || !user || !overviewId) return

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      doc => {
        if (doc.exists()) {
          const result = doc.data() as any
          console.log(">", result)
          setInfo(result)
          if (result && result.title) {
            setLoading(false)
          }
        }
      },
    )

    return unsubscribe
  }, [firestore, user, overviewId])

  useEffect(() => {
    if (!validateUrl(scrap.url) || !user) return
    // setLoading(true)
    // addDoc(collection(firestore, `users/${user.uid}/reviewOverview`), {
    //   url: scrap.url,
    // })
    //   .then(docRef => setOverviewId(docRef.id))
    //   .catch(error => console.error("Error adding document:", error))
  }, [user, scrap.url])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <form>
            <div className="mb-3">
              <label className="form-label">Google Maps URL</label>
              <input
                type="url"
                value={scrap.url}
                onChange={e => handleInputChange("url", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                disabled={loading}
                className="form-control"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!info.reviews}
            >
              Submit
            </button>
            <hr />
            <div className="card">
              <div className="card-body">Ads</div>
            </div>
          </form>
        </div>
        <div className="col-md-5">
          <div className="form-check d-flex flex-column gap-3 tariffs">
            <div
              className={`card py-3 px-2 ${selectedTariff === "default" && "tariffs__active-border"}`}
            >
              <div className="card-body d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="tariffRadio"
                    value={"default"}
                    checked={selectedTariff === "default"}
                    onChange={handleTariffChange}
                  />
                </div>
                <div className="tariffs-content">
                  <h5 className="card-title">Default</h5>
                  <p className="text-secondary fw-light">
                    Basic scraping of Google Maps reviews. Extracting from about
                    100 reviews
                  </p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item text-secondary fw-light">
                      Extracting from 100 reviews
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting image URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting video URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting owner responses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className={`card py-3 px-2 ${selectedTariff === "basic" && "tariffs__active-border"}`}
            >
              <div className="card-body d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioBasic"
                    id="tariffRadio"
                    value={"basic"}
                    checked={selectedTariff === "basic"}
                    onChange={handleTariffChange}
                  />
                </div>
                <div className="col">
                  <h5 className="card-title">Basic</h5>
                  <p className="text-secondary fw-light">
                    Basic scraping of Google Maps reviews. Extracting from about
                    500 reviews
                  </p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item text-secondary fw-light">
                      Extracting from 500 reviews
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting image URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting video URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting owner responses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className={`card py-3 px-2 ${selectedTariff === "pro" && "tariffs__active-border"}`}
            >
              <div className="card-body d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioPro"
                    id="tariffRadio"
                    value={"pro"}
                    checked={selectedTariff === "pro"}
                    onChange={handleTariffChange}
                  />
                </div>
                <div className="col">
                  <h5 className="card-title">Pro</h5>
                  <p className="text-secondary fw-light">
                    Basic scraping of Google Maps reviews. Extracting from about
                    1000 reviews
                  </p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item text-secondary fw-light">
                      Extracting from 1000 reviews
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting image URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting video URLs
                    </li>
                    <li className="list-group-item text-secondary fw-light">
                      Extracting owner responses
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scrap
