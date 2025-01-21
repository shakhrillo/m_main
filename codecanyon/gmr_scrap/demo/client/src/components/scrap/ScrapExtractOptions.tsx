import {
  IconCheck,
  IconCircleDashed,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { createElement, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  FormCheck,
  FormGroup,
  FormLabel,
  Row,
  Stack,
} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

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
export const ScrapExtractOptions = () => {
  const [extractOptions, setExtractOptions] = useState({
    extractImageUrls: false,
    extractVideoUrls: false,
    extractOwnerResponse: false,
  } as Record<string, boolean>);

  return (
    <FormGroup controlId="extractOptions">
      <FormLabel className="form-label">Options</FormLabel>
      <Row className="g-3">
        {EXTRACT_OPTIONS.map((option, index) => (
          <Col lg={6} xxl={4} key={index}>
            <Card>
              <CardBody>
                <FormCheck
                  type="checkbox"
                  className="position-absolute visually-hidden"
                  id={option.id}
                  value={option.id}
                />
                <FormCheckLabel htmlFor={option.id}>
                  <span
                    className={
                      "position-absolute top-0 end-0 rounded-circle mt-n2 me-n2 border bg-warning " +
                      (extractOptions[option.id] === true
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

                  <Stack direction="horizontal" gap={3}>
                    {createElement(option.icon, {
                      size: 48,
                      className: "text-body-secondary",
                    })}
                    <div>
                      <h5 className="m-0">{option.title}</h5>
                      <div className="badge bg-secondary">+23 points</div>
                    </div>
                  </Stack>
                </FormCheckLabel>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </FormGroup>
  );
};
