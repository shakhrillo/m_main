import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../contexts/FirebaseProvider";
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../services/firebaseService";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import validateUrl from "../utils/validateUrl";
import helperGif from "../assets/images/helper.gif";

const Scrap = () => {
  const { user, firestore } = useFirebase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [overviewId, setOverviewId] = useState("");

  const [info, setInfo] = useState({} as any);
  const [scrap, setScrap] = useState({
    url: "",
    limit: 30,
    sortBy: "Most relevant",
    extractVideoUrls: false,
    extractImageUrls: false,
    ownerResponse: true,
  });
  const [selectedTariff, setSelectedTariff] = useState("default");

  const handleTariffChange = (event: any) => {
    setSelectedTariff(event.target.value);
  };

  // Handlers for input changes
  const handleInputChange = useCallback(
    (name: string, value: string | number) =>
      setScrap((prev) => ({ ...prev, [name]: value })),
    [],
  );

  const handleCheckboxChange = (name: string) =>
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }));

  // Function to start scraping reviews
  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await startExtractGmapReviews(user!.uid, overviewId, {
        ...info,
        ...scrap,
      });
      navigate(`/reviews/${overviewId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firestore || !user || !overviewId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviewOverview/${overviewId}`),
      (doc) => {
        if (doc.exists()) {
          const result = doc.data() as any;
          console.log(">", result);
          setInfo(result);
          if (result && result.title) {
            setLoading(false);
          }
        }
      },
    );

    return unsubscribe;
  }, [firestore, user, overviewId]);

  useEffect(() => {
    if (!validateUrl(scrap.url) || !user) return;
    // setLoading(true)
    // addDoc(collection(firestore, `users/${user.uid}/reviewOverview`), {
    //   url: scrap.url,
    // })
    //   .then(docRef => setOverviewId(docRef.id))
    //   .catch(error => console.error("Error adding document:", error))
  }, [user, scrap.url]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h2 className="dashboard-title">Premium Scraping</h2>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Google Maps URL</label>
                  <input
                    type="url"
                    value={scrap.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    disabled={loading}
                    className="form-control"
                  />
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <button className="btn btn-secondary w-100">Cancel</button>
                  </div>
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={!info.reviews}
                    >
                      Get Place Info
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                How to get the Google Maps URL for the place you want to scrape
              </h5>
              <ul className="list-group list-group-flush list-group-numbered mt-3">
                <li className="list-group-item">Go to the Google Maps</li>
                <li className="list-group-item">
                  Search for the place you want to scrape
                </li>
                <li className="list-group-item">Click on the share button</li>
                <li className="list-group-item">
                  Click on the copy link button
                </li>
                <li className="list-group-item">
                  Paste the link in the input field
                </li>
              </ul>
              <img
                src={helperGif}
                alt="helper"
                className="w-100 rounded mt-4"
              />
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row row-cols-1 g-3">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex fs-5">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      name="tariff"
                      value=""
                      id="defaultPrice"
                      checked
                    />
                    <label className="form-check-label" htmlFor="defaultPrice">
                      Basic Scraping
                      <span className="ms-2 badge bg-primary">
                        1 point per review
                      </span>
                    </label>
                  </div>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="imageCheckbox"
                        checked
                        disabled
                      />
                      <label
                        className="form-check-label"
                        htmlFor="imageCheckbox"
                      >
                        Image URLs
                      </label>
                    </li>
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="videoCheckbox"
                        checked
                        disabled
                      />
                      <label
                        className="form-check-label"
                        htmlFor="videoCheckbox"
                      >
                        Video URLs
                      </label>
                    </li>
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="ownerResponseCheckbox"
                        checked
                        disabled
                      />
                      <label
                        className="form-check-label"
                        htmlFor="ownerResponseCheckbox"
                      >
                        Owner Response
                      </label>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-between mt-3">
                    <span>Forecasted price: 0.00 USD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex fs-5">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      name="tariff"
                      value=""
                      id="defaultPrice"
                      checked
                    />
                    <label className="form-check-label" htmlFor="defaultPrice">
                      Basic Scraping
                      <span className="ms-2 badge bg-primary">
                        1 point per review
                      </span>
                    </label>
                  </div>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="imageCheckbox"
                        checked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="imageCheckbox"
                      >
                        Image URLs
                      </label>
                    </li>
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="videoCheckbox"
                        checked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="videoCheckbox"
                      >
                        Video URLs
                      </label>
                    </li>
                    <li className="list-group-item p-0">
                      <input
                        className="form-check-input me-3"
                        type="checkbox"
                        value=""
                        id="ownerResponseCheckbox"
                        checked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="ownerResponseCheckbox"
                      >
                        Owner Response
                      </label>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-between mt-3">
                    <span>Forecasted price: 0.00 USD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <div className="col">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStartScraping}
                    disabled={loading}
                  >
                    Start Scraping
                  </button>
                </div>
              </div>
            </div>
            <div className="col">
              <p>
                Scraping reviews from Google Maps is a premium feature. You need
                to have enough points to start scraping. You can purchase points
                from the pricing page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrap;
