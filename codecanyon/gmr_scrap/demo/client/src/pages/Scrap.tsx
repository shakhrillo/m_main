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

import {
  IconWorldCheck,
  IconPhoto,
  IconStarFilled,
  IconCoins,
  IconVideo,
  IconMessageReply,
  IconPlayerPlay,
} from "@tabler/icons-react";

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
          if (result && result.rating) {
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

  function getPlaceInfo(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    addDoc(collection(firestore, `users/${user?.uid}/reviewOverview`), {
      url: scrap.url,
    })
      .then((docRef) => setOverviewId(docRef.id))
      .catch((error) => console.error("Error adding document:", error));
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3 border-primary">
            <div className="card-body">
              <form
                onSubmit={getPlaceInfo}
                className="mb-3 bg-light p-3 rounded"
              >
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
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={loading}
                >
                  Validate /
                  <IconCoins size={20} className="ms-1" /> 3 point
                </button>
              </form>
              <p>
                How to get the Google Maps URL for the place you want to scrape
              </p>
              <ol className="list-group list-group-numbered list-group-flush">
                <li className="list-group-item">
                  <a href="https://www.google.com/maps" target="_blank">
                    Go to the Google Maps
                  </a>
                </li>
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
              </ol>
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
                <div
                  style={{
                    backgroundImage: "url(" + info.screenshot + ")",
                    height: "180px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="w-100 card-img-top"
                ></div>
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <IconStarFilled size={16} className="text-warning" />
                    <span>{info.rating}</span>
                    <span>
                      ({Number(info.reviews || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                  <h5 className="card-title">
                    <span>{info.name || "Loading..."}</span>
                  </h5>
                  <p className="card-text">{info.address}</p>
                  <hr />
                  <div className="mb-3">
                    <label className="form-label">Maximum reviews</label>
                    <input
                      type="number"
                      value={scrap.limit}
                      onChange={(e) =>
                        handleInputChange("limit", Number(e.target.value))
                      }
                      disabled={loading}
                      className="form-control"
                    />
                  </div>
                  <div className="list-group mt-3 list-group-flush">
                    <a href="#" className="list-group-item" aria-current="true">
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <IconPhoto size={36} className="me-3 text-primary" />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h6 className="m-0">Images</h6>
                              <span className="badge bg-primary ms-2">
                                <IconCoins size={14} className="ms-1" /> 1 point
                              </span>
                            </div>
                            <p className="mb-1">
                              The points will be deducted for each image
                              extracted from the reviews.
                            </p>
                          </div>
                        </div>
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          name="tariff"
                          value=""
                          checked
                        />
                      </div>
                    </a>
                    <a href="#" className="list-group-item" aria-current="true">
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <IconVideo size={36} className="me-3 text-primary" />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h6 className="m-0">Videos</h6>
                              <span className="badge bg-primary ms-2">
                                <IconCoins size={14} className="ms-1" /> 3 point
                              </span>
                            </div>
                            <p className="mb-1">
                              The points will be deducted for each video
                              extracted from the reviews.
                            </p>
                          </div>
                        </div>
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          name="tariff"
                          value=""
                          checked
                        />
                      </div>
                    </a>
                    <a href="#" className="list-group-item" aria-current="true">
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <IconMessageReply
                            size={36}
                            className="me-3 text-primary"
                          />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h6 className="m-0">Owner Response</h6>
                              <span className="badge bg-primary ms-2">
                                <IconCoins size={14} className="ms-1" /> 1 point
                              </span>
                            </div>
                            <p className="mb-1">
                              The points will be deducted for each owner
                              response extracted from the reviews.
                            </p>
                          </div>
                        </div>
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          name="tariff"
                          value=""
                          checked
                        />
                      </div>
                    </a>
                  </div>
                  <button
                    className="btn btn-lg btn-primary mt-3"
                    disabled={loading}
                  >
                    <IconPlayerPlay size={20} className="me-2" />
                    Start Scraping / <IconCoins size={20} className="ms-1" /> 5
                    point
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrap;
