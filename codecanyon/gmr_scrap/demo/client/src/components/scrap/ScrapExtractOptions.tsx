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
  FormControl,
  FormLabel,
  FormSelect,
  FormText,
} from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

export const ScrapExtractOptions = ({
  container,
}: {
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
  const [limit, setLimit] = useState<number | undefined>(container.limit || 0);
  const [sortBy, setSortBy] = useState<
    "Most relevant" | "Newest" | "Highest rating" | "Lowest rating"
  >("Most relevant");

  useEffect(() => {
    if (!container.id) return;

    updateDockerContainer(container.id, {
      limit,
      sortBy,
      extractImageUrls,
      extractVideoUrls,
      extractOwnerResponse,
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
  ]);
  return (
    <>
      <Card>
        <CardBody
          className="d-flex align-items-start gap-3"
          onClick={() => setExtractImageUrls(!extractImageUrls)}
        >
          {createElement(IconPhoto, {
            className: "text-body-secondary",
          })}
          <span className="me-auto">
            Image URLs
            <Badge
              bg={extractImageUrls ? "success" : "secondary"}
              className="ms-2"
            >
              2 points
            </Badge>
          </span>
          {extractImageUrls ? (
            <IconCircleCheck className="text-success" />
          ) : (
            <IconCircleDashedCheck />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody
          className="d-flex align-items-start gap-3"
          onClick={() => setExtractVideoUrls(!extractVideoUrls)}
        >
          {createElement(IconVideo, {
            className: "text-body-secondary",
          })}
          <span className="me-auto">
            Video URLs
            <Badge
              bg={extractVideoUrls ? "success" : "secondary"}
              className="ms-2"
            >
              3 points
            </Badge>
          </span>
          {extractVideoUrls ? (
            <IconCircleCheck className="text-success" />
          ) : (
            <IconCircleDashedCheck />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody
          className="d-flex align-items-start gap-3"
          onClick={() => setExtractOwnerResponse(!extractOwnerResponse)}
        >
          {createElement(IconMessageReply, {
            className: "text-body-secondary",
          })}
          <span className="me-auto">
            Owner response
            <Badge
              bg={extractOwnerResponse ? "success" : "secondary"}
              className="ms-2"
            >
              1 point
            </Badge>
          </span>
          {extractOwnerResponse ? (
            <IconCircleCheck className="text-success" />
          ) : (
            <IconCircleDashedCheck />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="d-flex align-items-start gap-3">
          {createElement(IconFence, {
            className: "text-body-secondary",
          })}
          <div className="w-100">
            <FormLabel>Review limit</FormLabel>
            <FormControl
              placeholder="Review limit"
              value={limit}
              onChange={(e) => setLimit(+e.target.value)}
            />
            <FormText>
              Limit the number of reviews to extract. Leave empty to extract all
              reviews.
            </FormText>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="d-flex align-items-start gap-3">
          {createElement(IconArrowsSort, {
            className: "text-body-secondary",
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
            >
              <option value="Most relevant">Most relevant</option>
              <option value="Newest">Newest</option>
              <option value="Highest rating">Highest rating</option>
              <option value="Lowest rating">Lowest rating</option>
            </FormSelect>
            <FormText>
              Sort reviews by most relevant, newest, highest rating, or lowest
              rating.
            </FormText>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="d-flex align-items-start gap-3">
          {createElement(IconFile, {
            className: "text-body-secondary",
          })}
          <div className="w-100">
            <FormLabel>Output as</FormLabel>
            <FormSelect>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </FormSelect>
            <FormText>Output as a CSV or JSON file.</FormText>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
