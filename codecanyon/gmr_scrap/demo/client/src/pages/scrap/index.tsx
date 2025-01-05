import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { startExtractGmapReviews } from "../../services/firebaseService";
import validateUrl from "../../utils/validateUrl";

import {
  IconCoin,
  IconCoins,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import ScrapPlaceInfo from "./ScrapPlaceInfo";
import ScrapValidateForm from "./ScrapValidateForm";

const Scrap = () => {
  const { user, firestore } = useFirebase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [reviewId, setReviewId] = useState("");

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
      await startExtractGmapReviews(user!.uid, reviewId, {
        ...info,
        ...scrap,
      });
      navigate(`/reviews/${reviewId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firestore || !user || !reviewId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviews/${reviewId}`),
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
  }, [firestore, user, reviewId]);

  useEffect(() => {
    if (!validateUrl(scrap.url) || !user) return;
    // setLoading(true)
    // addDoc(collection(firestore, `users/${user.uid}/reviewOverview`), {
    //   url: scrap.url,
    // })
    //   .then(docRef => setReviewId(docRef.id))
    //   .catch(error => console.error("Error adding document:", error))
  }, [user, scrap.url]);

  function getPlaceInfo(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    addDoc(collection(firestore, `users/${user?.uid}/reviewOverview`), {
      url: scrap.url,
    })
      .then((docRef) => setReviewId(docRef.id))
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
      <div className="row row-cols-1 g-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Validate Place Info</h5>
              <form onSubmit={getPlaceInfo}>
                <div className="mb-3">
                  <label htmlFor="url" className="form-label">
                    Google Maps URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="url"
                    value={scrap.url}
                    placeholder="https://www.google.com/maps/place/..."
                    onChange={(e) => handleInputChange("url", e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary px-5">
                  Validate
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5>Extract Options</h5>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="limit" className="form-label">
                      Maximum number of reviews to extract
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="limit"
                      value={scrap.limit}
                      onChange={(e) =>
                        handleInputChange("limit", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="sortBy" className="form-label">
                      Sort by
                    </label>
                    <select
                      className="form-select"
                      id="sortBy"
                      value={scrap.sortBy}
                      onChange={(e) =>
                        handleInputChange("sortBy", e.target.value)
                      }
                    >
                      <option value="Most relevant">Most relevant</option>
                      <option value="Newest">Newest</option>
                      <option value="Rating">Rating</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="extractOptions" className="form-label">
                      Extract Options
                    </label>
                    <div className="row">
                      {[
                        "Extract image URLs",
                        "Extract video URLs",
                        "Owner response",
                      ].map((option, index) => (
                        <div className="col-md-4">
                          <div className="form-check position-relative p-0 border rounded">
                            <input
                              className="form-check-input position-absolute top-0 end-0 fs-3 mt-3 me-3"
                              type="checkbox"
                              id="extractImageUrls"
                              checked={scrap.extractImageUrls}
                              onChange={() =>
                                handleCheckboxChange("extractImageUrls")
                              }
                            />
                            <label
                              className="w-100 form-check-label p-3"
                              htmlFor="extractImageUrls"
                            >
                              <span className="fs-5">{option}</span>
                              <span className="d-block text-muted">
                                Extract image URLs from reviews. Each image URL
                              </span>
                              <span>
                                <IconCoin size={40} className="mb-3" />
                                <strong className="fs-1 me-1">2</strong>
                                points per review
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrap;
