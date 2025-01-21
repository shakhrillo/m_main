import { useOutletContext, useParams } from "react-router-dom";

import {
  IconCsv,
  IconJson,
  IconMail,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { PlaceInfo } from "../components/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";

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

  return (
    <Container>
      <Row className="g-3">
        <Col md={9}>
          <Stack direction={"vertical"} gap={3}>
            <ScrapValidateURL />
            <ScrapExtractOptions />
          </Stack>
        </Col>
        <Col md={3}>
          <PlaceInfo containerId={scrapId} className="mb-3" />
          <ScrapExpectedPoints containerId={scrapId} />
        </Col>
      </Row>
    </Container>
  );
};
