import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";
import {
  startExtractGmapReviews,
  startExtractGmapReviewsOverview,
} from "../../services/firebaseService";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import validateUrl from "../../utils/validateUrl";

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
import ScrapValidateForm from "./ScrapValidateForm";
import ScrapHelper from "./ScrapHelper";
import ScrapPlaceInfo from "./ScrapPlaceInfo";

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
        <div className="col-md-9">
          <div className="row row-cols-1 g-3">
            <div className="col">
              <ScrapValidateForm setDocumentId={setOverviewId} />
            </div>
            <div className="col">
              <div className="card scrap-form">
                <form className="row">
                  <div className="col">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="maxNumbers" className="form-label">
                            Maximum reviews
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="maxNumbers"
                            value={scrap.limit}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="machineType" className="form-label">
                            Machine type
                          </label>
                          <select
                            className="form-select"
                            id="machineType"
                            aria-label="Select machine type"
                          >
                            <option selected>Select machine type</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <div className="card">
                            <h5 className="card-header">Extract options</h5>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-auto">
                                  <input
                                    className="form-check-input fs-4"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckDefault"
                                  />
                                </div>
                                <div className="col">
                                  <div className="row g-3">
                                    <div className="col-md-4">
                                      <div className="card">
                                        <div className="card-body">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value=""
                                              id="extractVideoUrls"
                                            />
                                            <label
                                              className="form-check-label d-flex flex-column align-items-center"
                                              htmlFor="extractVideoUrls"
                                            >
                                              <IconPhoto size={50} />
                                              <span>Extract image URLs</span>
                                              <span>
                                                2 points /{" "}
                                                <span className="text-muted">
                                                  each review
                                                </span>
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="card">
                                        <div className="card-body">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value=""
                                              id="extractImageUrls"
                                            />
                                            <label
                                              className="form-check-label d-flex flex-column align-items-center"
                                              htmlFor="extractImageUrls"
                                            >
                                              <IconVideo size={50} />
                                              <span>Extract video URLs</span>
                                              <span>
                                                3 points /{" "}
                                                <span className="text-muted">
                                                  each review
                                                </span>
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="card">
                                        <div className="card-body">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value=""
                                              id="extractOwnerResponse"
                                            />
                                            <label
                                              className="form-check-label d-flex flex-column align-items-center"
                                              htmlFor="extractOwnerResponse"
                                            >
                                              <IconMessageReply size={50} />
                                              <span>
                                                Extract owner response
                                              </span>
                                              <span className="d-flex gap-1 align-items-center">
                                                <span className="badge bg-secondary">
                                                  1 points
                                                </span>
                                                <span>/</span>
                                                <span className="text-muted">
                                                  each review
                                                </span>
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/* <div className="card-body">
              <ScrapValidateForm setDocumentId={setOverviewId} />
              <ScrapHelper />
            </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <ScrapPlaceInfo info={info} />
        </div>
      </div>
    </div>
  );
};

export default Scrap;
