import { Row, Col } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { createElement, JSX } from "react";
import {
  Icon,
  IconArrowsSort,
  IconCamera,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

type PlaceInfoRowProps = {
  icon: Icon;
  label: string;
  value: string | number | undefined;
};

const PlaceInfoRow = ({ icon, label, value }: PlaceInfoRowProps) => (
  <div className="text-secondary d-flex align-items-center">
    {createElement(icon, {
      size: 30,
    })}
    <div className="ms-3">
      <h6 className="m-0">{label}</h6>
      <small className="text-break">{value}</small>
    </div>
  </div>
);

export const PlaceInfoOptions = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  return (
    <Row className="row-cols-1 g-3">
      <Col>
        <PlaceInfoRow
          icon={IconPhoto}
          label="Extract Images"
          value={container.extractImageUrls ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconVideo}
          label="Extract Images"
          value={container.extractVideoUrls ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconMessageReply}
          label="Extract Owner Replies"
          value={container.extractOwnerResponse ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconFence}
          label="Limit"
          value={container.limit || "Default"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconArrowsSort}
          label="Sort By"
          value={container.sortBy || "Default"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconFile}
          label="Output Format"
          value={container.outputAs || "Default"}
        />
      </Col>
    </Row>
  );
};
