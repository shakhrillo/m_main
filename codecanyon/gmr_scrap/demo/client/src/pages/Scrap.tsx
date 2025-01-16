import { useNavigate, useOutletContext, useParams } from "react-router-dom";

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
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react";
import {
  IReview,
  startScrap,
  validateUrl,
  validateUrlData,
} from "../services/scrapService";
import { PlaceInfo } from "../components/PlaceInfo";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  Row,
  Stack,
} from "react-bootstrap";

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

export const Scrap = () => {
  const { uid } = useOutletContext<User>();
  const { scrapId } = useParams() as { scrapId: string };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<IReview>({} as IReview);
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
    if (!scrapId) return;
  }, [scrapId]);

  useEffect(() => {
    const placeInfoSubbscription = validateUrlData(scrapId, uid).subscribe(
      (data) => {
        console.log("info", data);
        setPlaceInfo(data);
        setSortBy(data.sortBy || "Most relevant");
        setLimit(data.limit || 10);
        setExtractOptions({
          extractImageUrls: data.extractImageUrls || false,
          extractVideoUrls: data.extractVideoUrls || false,
          extractOwnerResponse: data.extractOwnerResponse || false,
        });
        setUrl(data.url || "");
        setLoading(false);
        setIsValidated(true);
        // setOutputOptions({
        //   json: data.json || true,
        //   csv: data.csv || false,
        // });
        // setNotificationOptions({
        //   notificationEmail: data.notificationEmail || false,
        // });
      },
    );

    return () => {
      placeInfoSubbscription.unsubscribe();
    };
  }, [scrapId, uid]);

  useEffect(() => {
    if (!documentId) return;

    const unsubscribe = validateUrlData(documentId, uid).subscribe((data) => {
      setPlaceInfo(data);
      if (data?.reviews > 0) {
        setIsValidated(true);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [documentId]);

  /**
   * Validation URL
   * @param e Form event
   */
  async function handleUrlValidation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;

    target.classList.add("was-validated");
    if (!target.checkValidity()) return;

    setLoading(true);

    try {
      const id = await validateUrl(url, uid);
      setDocumentId(id);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Clear results and reset the form
   */
  function clearResults() {
    setPlaceInfo({} as IReview);
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

  /**
   * Start Scrap process
   */
  async function handleStartScrap() {
    setLoading(true);
    try {
      const id = await startScrap(uid, {
        ...placeInfo,
        type: "comments",
        url,
        limit,
        sortBy,
        extractImageUrls: extractOptions.extractImageUrls,
        extractVideoUrls: extractOptions.extractVideoUrls,
        extractOwnerResponse: extractOptions.extractOwnerResponse,
      });
      navigate(`/reviews/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Row className="g-3">
        <Col md={9}>
          <Stack direction={"vertical"} gap={3}>
            {/*---Validate Place Info---*/}
            <Card>
              <CardBody>
                <CardTitle>Validate Place Info</CardTitle>
                <Form
                  onSubmit={handleUrlValidation}
                  noValidate
                  id="validateForm"
                >
                  <Form.Group className="mb-3" controlId="url">
                    <Form.Label>Google Maps URL</Form.Label>
                    <FormControl
                      type="text"
                      className="form-control"
                      value={url}
                      placeholder="https://www.google.com/maps/place/..."
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loading}
                      pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
                      itemRef="url"
                      required
                    />
                    <Form.Text className="invalid-feedback">
                      <IconAlertCircle className="me-2" size={20} />
                      Given URL is not valid. Example URL:
                      https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
                    </Form.Text>
                  </Form.Group>
                  <Stack direction={"horizontal"}>
                    {placeInfo?.rating && (
                      <Button
                        variant="secondary"
                        type="reset"
                        onClick={clearResults}
                      >
                        Clear results
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      type="submit"
                      className="ms-auto"
                      disabled={loading}
                    >
                      {loading ? (
                        "Validating..."
                      ) : (
                        <>
                          Validate{" "}
                          <Badge className="bg-secondary ms-2">3 points</Badge>
                        </>
                      )}
                    </Button>
                  </Stack>
                </Form>
              </CardBody>
            </Card>
            {/*---End: Validate Place Info---*/}

            {/*---Extract Options---*/}
            <Card>
              <CardBody>
                <CardTitle>Extract Options</CardTitle>
                <Form noValidate className="needs-validation was-validated">
                  <Row className="g-3">
                    <Col lg={6}>
                      <Form.Group controlId="limit">
                        <Form.Label>Review limit</Form.Label>
                        <Form.Control
                          type="text"
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
                        <Form.Control.Feedback type="invalid">
                          <IconAlertCircle className="me-2" size={20} />
                          Please enter a valid number between 10 and 5,000.
                        </Form.Control.Feedback>
                        <Form.Text id="maxExtractHelpBlock">
                          Maximum 5,000 reviews can be extracted at a time.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group controlId="sortBy">
                        <Form.Label aria-describedby="sortByHelpBlock">
                          Sorts by
                        </Form.Label>
                        <Form.Control
                          as={"select"}
                          id="sortBy"
                          required
                          onChange={(e) => setSortBy(e.target.value)}
                          disabled={loading || !isValidated}
                        >
                          <option value="Most relevant">Most relevant</option>
                          <option value="Newest">Newest</option>
                          <option value="Rating">Rating</option>
                        </Form.Control>
                        <Form.Text id="sortByHelpBlock">
                          Sort reviews by most relevant, newest, or rating. By
                          default, reviews are sorted by most relevant and less
                          than 500 reviews can be extracted at a time.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="extractOptions">
                        <Form.Label
                          htmlFor="extractOptions"
                          className="form-label"
                        >
                          Options
                        </Form.Label>
                        <Row className="g-3">
                          {EXTRACT_OPTIONS.map((option, index) => (
                            <Col lg={6} xxl={4} key={index}>
                              <Card
                                className={
                                  "form-check position-relative p-0 rounded border " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : extractOptions[option.id] === true
                                      ? "border-primary text-primary"
                                      : "border-light-subtle")
                                }
                              >
                                <FormCheck
                                  type="checkbox"
                                  className="position-absolute visually-hidden"
                                  id={option.id}
                                  value={option.id}
                                  onChange={(e) =>
                                    setExtractOptions({
                                      ...extractOptions,
                                      [option.id]: e.target.checked,
                                    })
                                  }
                                  disabled={loading || !isValidated}
                                  checked={extractOptions[option.id] || false}
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
                                    <IconCircleDashed
                                      size={20}
                                      className="m-1"
                                    />
                                  )}
                                </span>

                                <CardBody
                                  className="w-100 p-3"
                                  // htmlFor={option.id}
                                >
                                  <CardTitle>
                                    {createElement(option.icon, {
                                      size: 40,
                                      className: "text-primary me-2",
                                      strokeWidth: 2,
                                    })}
                                    {option.title}
                                  </CardTitle>
                                  <CardText className="my-2">
                                    {option.description}
                                  </CardText>
                                  <CardText className="d-block">
                                    <IconCoin size={30} className="mb-3" />
                                    <strong className="fs-1 mx-1">
                                      {option.points}
                                    </strong>
                                    points per review
                                  </CardText>
                                </CardBody>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*---End: Extract Options---*/}

            {/*---Output Options---*/}
            <Card>
              <CardBody>
                <CardTitle>Output Options</CardTitle>
                <Form noValidate className="needs-validation was-validated">
                  <Row className="g-3">
                    <Col md={12}>
                      <FormLabel htmlFor="outputOptions" className="form-label">
                        Result format
                      </FormLabel>
                      <Row className="g-3">
                        {OUTPUT_OPTIONS.map((option, index) => (
                          <Col lg={6} key={index}>
                            <Card
                              className={
                                "form-check position-relative p-0 rounded border " +
                                (loading || !isValidated
                                  ? "text-body-tertiary bg-body-secondary"
                                  : outputOptions[option.id] === true
                                    ? "border-primary text-primary"
                                    : "border-light-subtle")
                              }
                            >
                              <FormCheck
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
                                className="position-absolute visually-hidden"
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
                              <CardBody className="w-100 p-3">
                                <CardTitle>
                                  {createElement(option.icon, {
                                    size: 40,
                                    className: "me-2",
                                  })}
                                </CardTitle>
                                <CardText className="my-2">
                                  {option.description}
                                </CardText>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*---End: Output Options---*/}

            {/*---Output Options---*/}
            <Card>
              <CardBody className="card-body">
                <CardTitle>Notification Options</CardTitle>
                <Form noValidate className="needs-validation was-validated">
                  <Row className="g-3">
                    <Col md={12} className="col-md-12">
                      <FormLabel
                        htmlFor="notificationEmail"
                        className="form-label"
                      >
                        Notification settings
                      </FormLabel>
                      <Row>
                        {NOTIFICATION_OPTIONS.map((option, index) => (
                          <Col lg={6} key={index}>
                            <Card
                              className={
                                "form-check position-relative p-0 rounded border " +
                                (loading || !isValidated
                                  ? "text-body-tertiary bg-body-secondary"
                                  : notificationOptions[option.id] === true
                                    ? "border-primary text-primary"
                                    : "border-light-subtle")
                              }
                            >
                              <FormCheck
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
                                className="form-check-input position-absolute visually-hidden"
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
                              <CardBody className="w-100 p-3">
                                <CardTitle>
                                  {createElement(option.icon, {
                                    size: 40,
                                    className: "me-2",
                                  })}
                                </CardTitle>
                                <CardText className="my-2">
                                  {option.description}
                                </CardText>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*---End: Output Options---*/}
          </Stack>
        </Col>
        <div className="col-md-3">
          <PlaceInfo info={placeInfo} className="mb-3" />

          {/*---Expected Points---*/}
          <Card>
            <CardBody>
              {placeInfo?.rating && (
                <>
                  <CardTitle>Expected Points:</CardTitle>
                  <Stack direction={"horizontal"}>
                    Reviews ({limit || 0})
                    <strong className="ms-auto">{limit * 1} points</strong>
                  </Stack>
                  <Stack direction={"horizontal"}>
                    Image URLs (~{limit * 10 || 0})
                    <strong className="ms-auto">
                      ~{limit * 2 * 10 || 0} points
                    </strong>
                  </Stack>
                  <Stack direction={"horizontal"}>
                    Video URLs (~{limit * 10 || 0})
                    <strong className="ms-auto">
                      ~{limit * 3 * 10 || 0} points
                    </strong>
                  </Stack>
                  <Stack direction={"horizontal"}>
                    Owner responses (~{limit || 0})
                    <strong className="ms-auto">
                      ~{limit * 1 || 0} points
                    </strong>
                  </Stack>
                  <hr />
                  <Stack direction={"horizontal"}>
                    Total
                    <strong className="ms-auto">
                      {limit * 1} ~ {limit * 6 * 10}
                      points
                    </strong>
                  </Stack>
                </>
              )}
              <FormCheck
                className="mt-3"
                type="checkbox"
                id="terms"
                label={
                  <>
                    I agree to the{" "}
                    <a href="#" target="_blank" rel="nooper noreferrer">
                      terms and conditions
                    </a>
                  </>
                }
              ></FormCheck>
              <Button
                variant="primary"
                className="w-100 mt-3"
                disabled={loading || !isValidated || !isTermsAccepted}
                onClick={handleStartScrap}
              >
                Scrap
              </Button>
            </CardBody>
          </Card>
          {/*---End: Expected Points---*/}
        </div>
      </Row>
    </Container>
  );
};
