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
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Stack,
} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";

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
  const [extractOptions, setExtractOptions] = useState<{
    extractImageUrls: boolean;
    extractVideoUrls: boolean;
    extractOwnerResponse: boolean;
  }>({
    extractImageUrls: false,
    extractVideoUrls: false,
    extractOwnerResponse: false,
  });
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
    console.log("-+-".repeat(20));
    console.log(scrapId);
    console.log("-+-".repeat(20));
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

  // /**
  //  * Validation URL
  //  * @param e Form event
  //  */
  // async function handleUrlValidation(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const target = e.currentTarget as HTMLFormElement;
  //   target.classList.add("was-validated");
  //   if (!target.checkValidity()) return;

  //   try {
  //     const id = await validateUrl(url, uid);
  //     navigate(`/scrap/${id}`);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
  console.log("placeInfo", placeInfo);

  return (
    <Container>
      <Row className="g-3">
        <Col md={9}>
          <Stack direction={"vertical"} gap={3}>
            {/*---Validate Place Info---*/}
            <ScrapValidateURL />
            {/* <Card>
              <CardBody>
                <CardTitle>Validate Place Info</CardTitle>
                <Form
                  onSubmit={handleUrlValidation}
                  noValidate
                  id="validateForm"
                >
                  <FormGroup className="mb-3" controlId="url">
                    <FormLabel>Google Maps URL</FormLabel>
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
                    <FormText className="invalid-feedback">
                      <IconAlertCircle className="me-2" size={20} />
                      Given URL is not valid. Example URL:
                      https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
                    </FormText>
                  </FormGroup>
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
            </Card> */}
            {/*---End: Validate Place Info---*/}

            {/*---Extract Options---*/}
            <Card>
              <CardBody>
                <CardTitle>Extract Options</CardTitle>
                <Form noValidate className="needs-validation was-validated">
                  <Row className="g-3">
                    <Col lg={6}>
                      <FormGroup controlId="limit">
                        <FormLabel>Review limit</FormLabel>
                        <FormControl
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
                        <FormControl.Feedback type="invalid">
                          <IconAlertCircle className="me-2" size={20} />
                          Please enter a valid number between 10 and 5,000.
                        </FormControl.Feedback>
                        <FormText id="maxExtractHelpBlock">
                          Maximum 5,000 reviews can be extracted at a time.
                        </FormText>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup controlId="sortBy">
                        <FormLabel aria-describedby="sortByHelpBlock">
                          Sorts by
                        </FormLabel>
                        <FormControl
                          as={"select"}
                          //  id="sortBy"
                          required
                          onChange={(e) => setSortBy(e.target.value)}
                          disabled={loading || !isValidated}
                        >
                          <option value="Most relevant">Most relevant</option>
                          <option value="Newest">Newest</option>
                          <option value="Rating">Rating</option>
                        </FormControl>
                        <FormText id="sortByHelpBlock">
                          Sort reviews by most relevant, newest, or rating. By
                          default, reviews are sorted by most relevant and less
                          than 500 reviews can be extracted at a time.
                        </FormText>
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup controlId="extractOptions">
                        <FormLabel className="form-label">Options</FormLabel>
                        <Row className="g-3">
                          {/* {EXTRACT_OPTIONS.map((option, index) => (
                            <Col lg={6} xxl={4} key={index}>
                              <FormCheck
                                type="checkbox"
                                className="position-absolute visually-hidden"
                                id={option.id}
                                value={option.id}
                                onChange={(e) => {
                                  console.log(e);
                                  return setExtractOptions({
                                    ...extractOptions,
                                    [option.id]: e.target.checked,
                                  });
                                }}
                                disabled={loading || !isValidated}
                                checked={extractOptions[option.id] || false}
                              />
                              <FormCheckLabel
                                htmlFor={option.id}
                                className="w-100 h-100"
                              >
                                <Card
                                  className={
                                    "position-relative p-0 rounded border " +
                                    (loading || !isValidated
                                      ? "text-body-tertiary bg-body-secondary"
                                      : extractOptions[option.id] === true
                                        ? "border-primary text-primary"
                                        : "border-light-subtle")
                                  }
                                >
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

                                  <CardBody className="w-100 p-3">
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
                              </FormCheckLabel>
                            </Col>
                          ))} */}
                        </Row>
                      </FormGroup>
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
                      <FormLabel className="form-label">
                        Result format
                      </FormLabel>
                      <Row className="g-3">
                        {OUTPUT_OPTIONS.map((option, index) => (
                          <Col lg={6} key={index}>
                            <FormCheck
                              type="checkbox"
                              checked={outputOptions[option.id] || false}
                              id={option.id}
                              value={option.id}
                              onChange={(e) => {
                                console.log(e.target.id, e.target.checked); // Debugging
                                const { id, checked } = e.target;
                                setOutputOptions((prevOptions) => ({
                                  ...prevOptions,
                                  [id]: checked,
                                }));
                              }}
                              // disabled={loading || !isValidated}
                              className="position-absolute visually-hidden"
                            />
                            <FormCheckLabel
                              htmlFor={option.id}
                              className="w-100 h-100"
                            >
                              <Card
                                className={
                                  "position-relative p-0 rounded border " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : outputOptions[option.id] === true
                                      ? "border-primary text-primary"
                                      : "border-light-subtle")
                                }
                              >
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
                                    <IconCircleDashed
                                      size={20}
                                      className="m-1"
                                    />
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
                            </FormCheckLabel>
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
                      <FormLabel className="form-label">
                        Notification settings
                      </FormLabel>
                      <Row>
                        {NOTIFICATION_OPTIONS.map((option, index) => (
                          <Col lg={6} key={index}>
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
                            <FormCheckLabel
                              htmlFor={option.id}
                              className="w-100 h-100"
                            >
                              <Card
                                className={
                                  "position-relative p-0 rounded border " +
                                  (loading || !isValidated
                                    ? "text-body-tertiary bg-body-secondary"
                                    : notificationOptions[option.id] === true
                                      ? "border-primary text-primary"
                                      : "border-light-subtle")
                                }
                              >
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
                                    <IconCircleDashed
                                      size={20}
                                      className="m-1"
                                    />
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
                            </FormCheckLabel>
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
        <Col md={3}>
          <PlaceInfo containerId={scrapId} className="mb-3" />
          <ScrapExpectedPoints containerId={scrapId} />
          {/*---Expected Points---*/}
          {/* {placeInfo.rating && (
            <Card>
              <CardBody>
                {placeInfo?.rating && (
                  <Stack gap={2}>
                    <CardTitle className="place-info-title">
                      Expected Points:
                    </CardTitle>

                    <Stack
                      direction={"horizontal"}
                      className="justify-content-between"
                    >
                      Reviews ({limit || 0})<b>{limit * 1} points</b>
                    </Stack>
                    <Stack
                      direction={"horizontal"}
                      className="justify-content-between"
                    >
                      Image URLs (~{limit * 10 || 0})
                      <b>~{limit * 2 * 10 || 0} points</b>
                    </Stack>
                    <Stack
                      direction={"horizontal"}
                      className="justify-content-between"
                    >
                      Video URLs (~{limit * 10 || 0})
                      <b>~{limit * 3 * 10 || 0} points</b>
                    </Stack>
                    <Stack
                      direction={"horizontal"}
                      className="justify-content-between"
                    >
                      Owner responses (~{limit || 0})
                      <b>~{limit * 1 || 0} points</b>
                    </Stack>
                    <hr />
                    <Stack direction={"horizontal"}>
                      Total
                      <strong className="ms-auto">
                        {limit * 1} ~ {limit * 6 * 10}
                        points
                      </strong>
                    </Stack>
                  </Stack>
                )}
                <FormCheck
                  className="mt-3"
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  disabled={loading || !isValidated}
                  onChange={(e) => setIsTermsAccepted(!isTermsAccepted)}
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
          )} */}
          {/*---End: Expected Points---*/}
        </Col>
      </Row>
    </Container>
  );
};
