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
        <div className="col-md-4">
          <h2>Premium Scraping</h2>
          <p className="text-secondary">
            Extracting reviews from Google Maps with more features
          </p>
          <div className="card">
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
                  <div className="col-md-4">
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
          <div className="card mt-4">
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
              <img
                src={helperGif}
                alt="helper"
                className="w-100 rounded mt-4"
              />
              <img
                src={helperGif}
                alt="helper"
                className="w-100 rounded mt-4"
              />
            </div>
          </div>
        </div>
        <div className="col-md-8"></div>
      </div>
    </div>
  );
};

export default Scrap;
