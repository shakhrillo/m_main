import {
  IconArrowsSort,
  IconCircleCheck,
  IconCircleDashedCheck,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  FormText,
  Row,
  Stack,
} from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

export const ScrapExtractOptions = ({
  containerId,
  container,
}: {
  containerId: string | undefined;
  container: IDockerContainer;
}) => {
  const [extractImageUrls, setExtractImageUrls] = useState<boolean>(
    container.extractImageUrls || false,
  );
  const [extractVideoUrls, setExtractVideoUrls] = useState<boolean>(
    container.extractVideoUrls || false,
  );
  const [extractOwnerResponse, setExtractOwnerResponse] = useState<boolean>(
    container.extractOwnerResponse || false,
  );
  const [limit, setLimit] = useState<number | undefined>(container.limit || 10);
  const [sortBy, setSortBy] = useState<
    "Most relevant" | "Newest" | "Highest rating" | "Lowest rating"
  >("Most relevant");
  const [outputAs, setOutputAs] = useState<"json" | "csv">("json");

  useEffect(() => {
    setExtractImageUrls(container.extractImageUrls || false);
    setExtractVideoUrls(container.extractVideoUrls || false);
    setExtractOwnerResponse(container.extractOwnerResponse || false);
    setLimit(container.limit || 10);
    setSortBy(container.sortBy || "Most relevant");
    setOutputAs(container.outputAs || "json");
  }, [container]);

  useEffect(() => {
    if (!container.rating || !container.id || !containerId) return;

    updateDockerContainer(container.id, {
      limit,
      sortBy,
      extractImageUrls,
      extractVideoUrls,
      extractOwnerResponse,
      outputAs,
    }).catch((error) => {
      console.error("Error updating container limit:", error);
    });
  }, [
    container,
    limit,
    sortBy,
    extractImageUrls,
    extractVideoUrls,
    extractOwnerResponse,
    outputAs,
  ]);
  return (
    <>
      <Card>
        <CardBody>
          <CardTitle className="mb-3">Extract type</CardTitle>
          <Row className="g-3">
            <Col lg={4}>
              <Stack
                direction="horizontal"
                className="bg-light p-3 rounded gap-3"
                onClick={() =>
                  container.rating && setExtractImageUrls(!extractImageUrls)
                }
              >
                {createElement(IconPhoto, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <Stack className="d-flex me-auto" direction="vertical">
                  <h6 className="m-0">Image URLs</h6>
                  <div className="d-inline">
                    <Badge bg={extractImageUrls ? "success" : "secondary"}>
                      2 points
                    </Badge>
                  </div>
                </Stack>
                {createElement(
                  extractImageUrls ? IconCircleCheck : IconCircleDashedCheck,
                  {
                    className: extractImageUrls
                      ? "text-success"
                      : "text-body-secondary",
                    size: 30,
                  },
                )}
              </Stack>
            </Col>
            <Col lg={4}>
              <Stack
                direction="horizontal"
                className="bg-light p-3 rounded gap-3"
                onClick={() =>
                  container.rating && setExtractVideoUrls(!extractVideoUrls)
                }
              >
                {createElement(IconVideo, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <Stack className="d-flex me-auto" direction="vertical">
                  <h6 className="m-0">Video URLs</h6>
                  <div className="d-inline">
                    <Badge bg={extractVideoUrls ? "success" : "secondary"}>
                      3 points
                    </Badge>
                  </div>
                </Stack>
                {createElement(
                  extractVideoUrls ? IconCircleCheck : IconCircleDashedCheck,
                  {
                    className: extractVideoUrls
                      ? "text-success"
                      : "text-body-secondary",
                    size: 30,
                  },
                )}
              </Stack>
            </Col>
            <Col lg={4}>
              <Stack
                direction="horizontal"
                className="bg-light p-3 rounded gap-3"
                onClick={() =>
                  container.rating &&
                  setExtractOwnerResponse(!extractOwnerResponse)
                }
              >
                {createElement(IconMessageReply, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <Stack className="d-flex me-auto" direction="vertical">
                  <h6 className="m-0">Owner response</h6>
                  <div className="d-inline">
                    <Badge bg={extractOwnerResponse ? "success" : "secondary"}>
                      3 points
                    </Badge>
                  </div>
                </Stack>
                {createElement(
                  extractOwnerResponse
                    ? IconCircleCheck
                    : IconCircleDashedCheck,
                  {
                    className: extractOwnerResponse
                      ? "text-success"
                      : "text-body-secondary",
                    size: 30,
                  },
                )}
              </Stack>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <CardTitle className="mb-3">Extract options</CardTitle>
          <Row className="gap-3">
            <Col sm={12}>
              <Stack direction="horizontal" className="gap-3 align-items-start">
                {createElement(IconFence, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <div className="w-100">
                  <FormLabel>Review limit</FormLabel>
                  <FormControl
                    placeholder="Review limit"
                    value={limit}
                    onChange={(e) => setLimit(+e.target.value)}
                    disabled={!container.rating}
                    size="lg"
                  />
                  <FormText>
                    Limit the number of reviews to extract. Leave empty to
                    extract all reviews.
                  </FormText>
                </div>
              </Stack>
            </Col>
            <Col sm={12}>
              <Stack direction="horizontal" className="gap-3 align-items-start">
                {createElement(IconArrowsSort, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <div className="w-100">
                  <FormLabel>Sorts by</FormLabel>
                  <FormSelect
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "Most relevant"
                          | "Newest"
                          | "Highest rating"
                          | "Lowest rating",
                      )
                    }
                    disabled={!container.rating}
                    size="lg"
                  >
                    <option value="Most relevant">Most relevant</option>
                    <option value="Newest">Newest</option>
                    <option value="Highest rating">Highest rating</option>
                    <option value="Lowest rating">Lowest rating</option>
                  </FormSelect>
                  <FormText>
                    Sort reviews by most relevant, newest, highest rating, or
                    lowest rating.
                  </FormText>
                </div>
              </Stack>
            </Col>
            <Col>
              <Stack direction="horizontal" className="gap-3 align-items-start">
                {createElement(IconFile, {
                  className: "text-body-secondary",
                  size: 30,
                })}
                <div className="w-100">
                  <FormLabel>Output as</FormLabel>
                  <FormSelect
                    value={outputAs}
                    onChange={(e) =>
                      setOutputAs(e.target.value as "json" | "csv")
                    }
                    disabled={!container.rating}
                    size="lg"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </FormSelect>
                  <FormText>Output as a CSV or JSON file.</FormText>
                </div>
              </Stack>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
