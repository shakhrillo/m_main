import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";

import {
  IconAlertCircle,
  IconCheck,
  IconCircleDashed,
  IconCoin,
  IconCsv,
  IconJson,
  IconMail,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { createElement, use, useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";

const EXTRACT_OPTIONS = [
  {
    title: "Image URLs",
    description:
      "Extract image URLs from reviews, assigning 2 points to each URL. Accurately count and total the points based on the number of images found.",
    points: 2,
    id: "extractImageUrls",
    icon: IconPhoto,
  },
  {
    title: "Video URLs",
    description:
      "Extract video URLs from reviews, assigning 3 points to each URL. Accurately count and total the points based on the number of videos found.",
    points: 3,
    id: "extractVideoUrls",
    icon: IconVideo,
  },
  {
    title: "Owner response",
    description:
      "Extract owner responses from reviews, assigning 1 point to each response. Accurately count and total the points based on the number of responses found.",
    points: 1,
    id: "extractOwnerResponse",
    icon: IconMessageReply,
  },
];

const OUTPUT_OPTIONS = [
  {
    description: "Output the extracted data in JSON format.",
    id: "json",
    icon: IconJson,
  },
  {
    description: "Output the extracted data in CSV format.",
    id: "csv",
    icon: IconCsv,
  },
];

const NOTIFICATION_OPTIONS = [
  {
    description: "Send email notification when the extraction is complete.",
    id: "notificationEmail",
    icon: IconMail,
  },
];

const Scrap = () => {
  const { user, firestore } = useFirebase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<Record<string, any>>({});
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("Most relevant");
  const [extractOptions, setExtractOptions] = useState<Record<string, boolean>>(
    {
      extractImageUrls: false,
      extractVideoUrls: false,
      extractOwnerResponse: false,
    },
  );
  const [outputOptions, setOutputOptions] = useState<Record<string, boolean>>({
    json: true,
    csv: false,
  });
  const [notificationOptions, setNotificationOptions] = useState<
    Record<string, boolean>
  >({
    notificationEmail: false,
  });
  const [documentId, setDocumentId] = useState("");

  useEffect(() => {
    if (!firestore || !user || !documentId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user.uid}/reviews/${documentId}`),
      (doc) => {
        if (doc.exists()) {
          const result = doc.data() as any;
          console.log(">", result);
          setPlaceInfo(result);
          if (result && result.rating) {
            setLoading(false);
            setIsValidated(true);
          }
        }
      },
    );

    return unsubscribe;
  }, [firestore, user, documentId]);

  /**
   * Validation URL
   * @param e Form event
   */
  async function validateUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.classList.add("was-validated");

    if (!e.currentTarget.checkValidity()) {
      return;
    }

    setLoading(true);

    const uid = user?.uid;
    const collectionPath = `users/${uid}/reviews`;
    setLoading(true);

    try {
      const collectionRef = collection(firestore, collectionPath);
      const document = await addDoc(collectionRef, {
        url,
        type: "info",
      });
      setDocumentId(document.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding document: " + JSON.stringify(error));
    }
  }

  /**
   * Clear results and reset the form
   */
  function clearResults() {
    setPlaceInfo({});
    setIsValidated(false);
    setUrl("");
    setLimit(10);
    setSortBy("Most relevant");
    setExtractOptions({
      extractImageUrls: false,
      extractVideoUrls: false,
      extractOwnerResponse: false,
    });
    setOutputOptions({
      json: true,
      csv: false,
    });
    setNotificationOptions({
      notificationEmail: false,
    });
    setDocumentId("");
    (document.getElementById("validateForm") as HTMLFormElement)?.reset();
    (
      document.getElementById("validateForm") as HTMLFormElement
    )?.classList.remove("was-validated");
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex flex-column flex-grow-1 gap-3">
            {/*---Validate Place Info---*/}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Validate Place Info</h5>
                <form onSubmit={validateUrl} noValidate id="validateForm">
                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">
                      Google Maps URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="url"
                      value={url}
                      placeholder="https://www.google.com/maps/place/..."
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loading || placeInfo?.rating}
                      pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
                      itemRef="url"
                      required
                    />
                    <small className="invalid-feedback">
                      <IconAlertCircle className="me-2" size={20} />
                      Given URL is not valid. Example URL:
                      https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
                    </small>
                  </div>
                  <div className="d-flex">
                    {placeInfo?.rating && (
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        onClick={clearResults}
                      >
                        Clear results
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary ms-auto"
                      disabled={loading || placeInfo?.rating}
                    >
                      Validate{" "}
                      <span className="badge bg-secondary ms-2">3 points</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/*---End: Validate Place Info---*/}

            {/*---Extract Options---*/}
            <div className="card">
              <div className="card-body">
                <h5>Extract Options</h5>
                <form noValidate className="needs-validation was-validated">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="limit" className="form-label">
                        Maximum number of reviews to extract
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="limit"
                        pattern="^[1-9]\d{1,3}$"
                        aria-describedby="maxExtractHelpBlock"
                        placeholder="10 - 5,000"
                        value={limit}
                        onChange={(e) =>
                          setLimit(parseInt(e.target.value || "0", 10))
                        }
                        required
                        disabled={loading || !isValidated}
                      />
                      <small className="invalid-feedback">
                        <IconAlertCircle className="me-2" size={20} />
                        Please enter a valid number between 10 and 5,000.
                      </small>
                      <div id="maxExtractHelpBlock" className="form-text">
                        Maximum 5,000 reviews can be extracted at a time.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="sortBy"
                        className="form-label"
                        aria-describedby="sortByHelpBlock"
                      >
                        Sort by
                      </label>
                      <select
                        className="form-select"
                        id="sortBy"
                        required
                        onChange={(e) => setSortBy(e.target.value)}
                        disabled={loading || !isValidated}
                      >
                        <option value="Most relevant">Most relevant</option>
                        <option value="Newest">Newest</option>
                        <option value="Rating">Rating</option>
                      </select>
                      <div className="form-text" id="sortByHelpBlock">
                        Sort reviews by most relevant, newest, or rating. By
                        default, reviews are sorted by most relevant and less
                        than 500 reviews can be extracted at a time.
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="extractOptions" className="form-label">
                        Options
                      </label>
                      <div className="row">
                        {EXTRACT_OPTIONS.map((option, index) => (
                          <div className="col-md-4" key={index}>
                            <div
                              className={
                                "form-check position-relative p-0 rounded border " +
                                (loading || !isValidated
                                  ? "text-body-tertiary bg-body-secondary"
                                  : extractOptions[option.id] === true
                                    ? "border-primary text-primary"
                                    : "border-light-subtle")
                              }
                            >
                              <input
                                className="form-check-input position-absolute visually-hidden"
                                type="checkbox"
                                id={option.id}
                                value={option.id}
                                onChange={(e) =>
                                  setExtractOptions({
                                    ...extractOptions,
                                    [option.id]: e.target.checked,
                                  })
                                }
                                disabled={loading || !isValidated}
                              />
                              <span
                                className={
                                  "position-absolute top-0 end-0 rounded-circle mt-n2 me-n2 border bg-white " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : extractOptions[option.id] === true
                                      ? "border-primary"
                                      : "border-light-subtle")
                                }
                              >
                                {extractOptions[option.id] === true ? (
                                  <IconCheck size={20} className="m-1" />
                                ) : (
                                  <IconCircleDashed size={20} className="m-1" />
                                )}
                              </span>
                              <label className="w-100 p-3" htmlFor={option.id}>
                                <span className="fs-5">
                                  {createElement(option.icon, {
                                    size: 40,
                                    className: "me-2",
                                  })}
                                  {option.title}
                                </span>
                                <span className="d-block my-2">
                                  {option.description}
                                </span>
                                <span className="d-block">
                                  <IconCoin size={30} className="mb-3" />
                                  <strong className="fs-1 mx-1">
                                    {option.points}
                                  </strong>
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
            {/*---End: Extract Options---*/}

            {/*---Output Options---*/}
            <div className="card">
              <div className="card-body">
                <h5>Output Options</h5>
                <form noValidate className="needs-validation was-validated">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label htmlFor="outputOptions" className="form-label">
                        Result format
                      </label>
                      <div className="row">
                        {OUTPUT_OPTIONS.map((option, index) => (
                          <div className="col-md-6" key={index}>
                            <div
                              className={
                                "form-check position-relative p-0 rounded border " +
                                (loading || !isValidated
                                  ? "text-body-tertiary bg-body-secondary"
                                  : outputOptions[option.id] === true
                                    ? "border-primary text-primary"
                                    : "border-light-subtle")
                              }
                            >
                              <input
                                className="form-check-input position-absolute visually-hidden"
                                type="checkbox"
                                id={option.id}
                                value={option.id}
                                onChange={(e) =>
                                  setOutputOptions({
                                    ...outputOptions,
                                    [option.id]: e.target.checked,
                                  })
                                }
                                disabled={loading || !isValidated}
                              />
                              <span
                                className={
                                  "position-absolute top-0 end-0 rounded-circle mt-n2 me-n2 border bg-white " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : outputOptions[option.id] === true
                                      ? "border-primary"
                                      : "border-light-subtle")
                                }
                              >
                                {outputOptions[option.id] === true ? (
                                  <IconCheck size={20} className="m-1" />
                                ) : (
                                  <IconCircleDashed size={20} className="m-1" />
                                )}
                              </span>
                              <label className="w-100 p-3" htmlFor={option.id}>
                                <span className="fs-5">
                                  {createElement(option.icon, {
                                    size: 40,
                                    className: "me-2",
                                  })}
                                </span>
                                <span className="d-block my-2">
                                  {option.description}
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
            {/*---End: Output Options---*/}

            {/*---Output Options---*/}
            <div className="card">
              <div className="card-body">
                <h5>Notification Options</h5>
                <form noValidate className="needs-validation was-validated">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label htmlFor="notificationEmail" className="form-label">
                        Notification settings
                      </label>
                      <div className="row">
                        {NOTIFICATION_OPTIONS.map((option, index) => (
                          <div className="col-md-6" key={index}>
                            <div
                              className={
                                "form-check position-relative p-0 rounded border " +
                                (loading || !isValidated
                                  ? "text-body-tertiary bg-body-secondary"
                                  : notificationOptions[option.id] === true
                                    ? "border-primary text-primary"
                                    : "border-light-subtle")
                              }
                            >
                              <input
                                className="form-check-input position-absolute visually-hidden"
                                type="checkbox"
                                id={option.id}
                                value={option.id}
                                onChange={(e) =>
                                  setNotificationOptions({
                                    ...notificationOptions,
                                    [option.id]: e.target.checked,
                                  })
                                }
                                disabled={loading || !isValidated}
                              />
                              <span
                                className={
                                  "position-absolute top-0 end-0 rounded-circle mt-n2 me-n2 border bg-white " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : notificationOptions[option.id] === true
                                      ? "border-primary"
                                      : "border-light-subtle")
                                }
                              >
                                {notificationOptions[option.id] === true ? (
                                  <IconCheck size={20} className="m-1" />
                                ) : (
                                  <IconCircleDashed size={20} className="m-1" />
                                )}
                              </span>
                              <label className="w-100 p-3" htmlFor={option.id}>
                                <span className="fs-5">
                                  {createElement(option.icon, {
                                    size: 40,
                                    className: "me-2",
                                  })}
                                </span>
                                <span className="d-block my-2">
                                  {option.description}
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
            {/*---End: Output Options---*/}
          </div>
        </div>
        <div className="col-md-4">
          {/*---Place Info---*/}
          {placeInfo?.rating && (
            <div className="card mb-3">
              <img
                src={placeInfo?.screenshot}
                className="card-img-top"
                alt="Place Image"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {placeInfo?.title || "Place Name"} - {placeInfo?.rating || 0}{" "}
                  stars
                </h5>
                <a href={placeInfo?.url} target="_blank" className="card-link">
                  {placeInfo?.address}
                </a>
                <p className="card-text">
                  Reviews: <strong>{placeInfo?.reviews || 0}</strong>
                </p>
              </div>
            </div>
          )}
          {/*---End: Place Info---*/}

          {/*---Expected Points---*/}
          <div className="card">
            <div className="card-body">
              {placeInfo?.rating && (
                <>
                  <h5 className="card-title">Expected Points:</h5>
                  <div className="d-flex">
                    Reviews ({limit || 0})
                    <strong className="ms-auto">{limit * 1} points</strong>
                  </div>
                  <div className="d-flex">
                    Image URLs (~{limit * 10 || 0})
                    <strong className="ms-auto">
                      ~{limit * 2 * 10 || 0} points
                    </strong>
                  </div>
                  <div className="d-flex">
                    Video URLs (~{limit * 10 || 0})
                    <strong className="ms-auto">
                      ~{limit * 3 * 10 || 0} points
                    </strong>
                  </div>
                  <div className="d-flex">
                    Owner responses (~{limit || 0})
                    <strong className="ms-auto">
                      ~{limit * 1 || 0} points
                    </strong>
                  </div>
                  <hr />
                  <div className="d-flex">
                    Total
                    <strong className="ms-auto">
                      {limit * 1} ~ {limit * 6 * 10}
                      points
                    </strong>
                  </div>
                </>
              )}
              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  disabled={loading || !isValidated}
                />
                <label className="form-check-label" htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" target="_blank">
                    terms and conditions
                  </a>
                </label>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                disabled={loading || !isValidated}
                onClick={() => navigate("/scrap/result")}
              >
                Scrap
              </button>
            </div>
          </div>
          {/*---End: Expected Points---*/}
        </div>
      </div>
    </div>
  );
};

export default Scrap;
