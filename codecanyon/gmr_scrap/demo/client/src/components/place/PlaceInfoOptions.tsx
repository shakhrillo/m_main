import {
  Icon,
  IconArrowsSort,
  IconCoins,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { createElement } from "react";
import { Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";

type PlaceInfoRowProps = {
  icon: Icon;
  label: string;
  value: string | number | undefined;
};

const PlaceInfoRow = ({ icon, label, value }: PlaceInfoRowProps) => (
  <div className="place-info-details">
    {createElement(icon)}
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value || "N/A"}</div>
    </div>
  </div>
);

export const PlaceInfoOptions = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  return (
    <Row className="row-cols-1">
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
          label="Extract Videos"
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
          label="Max Reviews"
          value={container.limit || "Default"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={IconCoins}
          label="Max Spent Points"
          value={container.maxSpentPoints || "Default"}
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
