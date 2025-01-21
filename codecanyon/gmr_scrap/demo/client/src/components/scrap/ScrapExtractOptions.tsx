import {
  IconArrowsSort,
  IconCheck,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { createElement } from "react";
import {
  Badge,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormSelect,
  FormText,
} from "react-bootstrap";
import { ScrapExtractOption } from "./ScrapExtractOption";

// Define extraction options
const EXTRACT_OPTIONS = [
  {
    title: "Image URLs",
    description:
      "Extract image URLs from reviews. Assigns 2 points to each URL.",
    points: 2,
    id: "extractImageUrls",
    icon: IconPhoto,
  },
  {
    title: "Video URLs",
    description:
      "Extract video URLs from reviews. Assigns 3 points to each URL.",
    points: 3,
    id: "extractVideoUrls",
    icon: IconVideo,
  },
  {
    title: "Owner response",
    description:
      "Extract owner responses from reviews. Assigns 1 point to each response.",
    points: 1,
    id: "extractOwnerResponse",
    icon: IconMessageReply,
  },
];

export const ScrapExtractOptions = ({
  containerId,
}: {
  containerId: string;
}) => {
  return (
    <>
      {EXTRACT_OPTIONS.map((option) => (
        <ScrapExtractOption option={option} containerId={containerId} />
        // <Card key={option.id}>
        //   <CardBody className="d-flex align-items-start gap-3">
        //     {createElement(option.icon, {
        //       className: "text-body-secondary",
        //     })}
        //     <span className="d-inline">
        //       {option.title}
        //       <Badge bg="secondary" className="ms-2">
        //         {option.points} points
        //       </Badge>
        //     </span>
        //     <IconCheck className="ms-auto" />
        //   </CardBody>
        // </Card>
      ))}

      <Card>
        <CardBody className="d-flex align-items-start gap-3">
          {createElement(IconFence, {
            className: "text-body-secondary",
          })}
          <div className="w-100">
            <FormLabel>Review limit</FormLabel>
            <FormControl placeholder="Review limit" />
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
            <FormSelect>
              <option value="most-relevant">Most relevant</option>
              <option value="newest">Newest</option>
              <option value="highest-rating">Highest rating</option>
              <option value="lowest-rating">Lowest rating</option>
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
