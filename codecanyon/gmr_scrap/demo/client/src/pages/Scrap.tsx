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
  IconCaretRight,
  IconInfoCircle,
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

  function calculatePoints() {
    let points = scrap.limit || 0;

    if (scrap.extractImageUrls) {
      points += scrap.limit * 2;
    }

    if (scrap.extractVideoUrls) {
      points += scrap.limit * 3;
    }

    if (scrap.ownerResponse) {
      points += scrap.limit;
    }

    return points;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <form
                onSubmit={getPlaceInfo}
                className="mb-3 bg-primary-subtle p-3 rounded"
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
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <IconWorldCheck size={20} className="me-2" />
                  Validate (<IconCoins size={20} /> 3 points)
                </button>
              </form>
              <div className="mt-3 d-flex">
                <IconInfoCircle size={40} className="me-3" />
                <h5 className="m-0">
                  How to get the Google Maps URL for the place you want to
                  scrape
                </h5>
              </div>
              <ul className="list-unstyled mt-3">
                <li>
                  <IconCaretRight size={20} className="me-2" />
                  <a href="https://www.google.com/maps" target="_blank">
                    Go to the Google Maps
                  </a>
                </li>
                <li>
                  <IconCaretRight size={20} className="me-2" />
                  Search for the place you want to scrape
                </li>
                <li>
                  <IconCaretRight size={20} className="me-2" />
                  Click on the share button
                </li>
                <li>
                  <IconCaretRight size={20} className="me-2" />
                  Click on the copy link button
                </li>
                <li>
                  <IconCaretRight size={20} className="me-2" />
                  Paste the link in the input field
                </li>
              </ul>
              <iframe
                className="w-100 rounded mt-4"
                height="250"
                src="https://www.youtube.com/embed/TMjezeeGVfY?si=j9XaBxKYwdfBdcdv"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
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
                    backgroundColor: "#f5f5f5",
                  }}
                  className="w-100 card-img-top"
                ></div>
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <IconStarFilled size={16} className="text-warning" />
                    <span>{info.rating || "N/A"}</span>
                    <span>
                      ({Number(info.reviews || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                  <h5 className="card-title">
                    <span>{info.title || "Google Maps"}</span>
                  </h5>
                  <p className="card-text">{info.address}</p>
                  <div className="mb-3">
                    <label className="form-label">Maximum reviews</label>
                    <input
                      type="number"
                      value={scrap.limit}
                      onChange={(e) =>
                        handleInputChange("limit", Number(e.target.value))
                      }
                      disabled={loading || info.rating === undefined}
                      className="form-control form-control-lg"
                    />
                  </div>
                  <div className="list-group mt-3 list-group-flush">
                    <a
                      href="#"
                      className={`list-group-item ${info.rating === undefined || loading ? "disabled" : ""}`}
                      aria-disabled="true"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex">
                          <IconPhoto size={40} className="me-3 text-primary" />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h5 className="m-0">Images</h5>
                              <span className="badge bg-primary ms-2">
                                <IconCoins size={14} className="ms-1" /> 2 point
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
                          checked={scrap.extractImageUrls}
                          onChange={() =>
                            handleCheckboxChange("extractImageUrls")
                          }
                          disabled={info.rating === undefined || loading}
                        />
                      </div>
                    </a>
                    <a
                      href="#"
                      className={`list-group-item ${
                        info.rating === undefined || loading ? "disabled" : ""
                      }`}
                      aria-disabled="true"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex">
                          <IconVideo size={40} className="me-3 text-primary" />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h5 className="m-0">Videos</h5>
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
                          name="video"
                          checked={scrap.extractVideoUrls}
                          onChange={() =>
                            handleCheckboxChange("extractVideoUrls")
                          }
                          disabled={info.rating === undefined || loading}
                        />
                      </div>
                    </a>
                    <a
                      href="#"
                      className={`list-group-item ${info.rating === undefined || loading ? "disabled" : ""}`}
                      aria-disabled="true"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <div className="d-flex">
                          <IconMessageReply
                            size={40}
                            className="me-3 text-primary"
                          />
                          <div className="d-block">
                            <div className="d-flex align-items-center">
                              <h5 className="m-0">Owner Response</h5>
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
                          name="ownerResponse"
                          disabled={info.rating === undefined || loading}
                          checked={scrap.ownerResponse}
                          onChange={() => handleCheckboxChange("ownerResponse")}
                        />
                      </div>
                    </a>
                  </div>
                  <button
                    className="btn btn-lg btn-primary mt-3"
                    disabled={info.rating === undefined || loading}
                  >
                    <IconPlayerPlay size={20} className="me-2" />
                    Start Scraping / <IconCoins
                      size={20}
                      className="ms-1"
                    />{" "}
                    {calculatePoints()}
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
