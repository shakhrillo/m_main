import {
  Icon,
  IconCamera,
  IconCoins,
  IconMessage,
  IconMessageReply,
  IconStopwatch,
  IconVideo,
} from "@tabler/icons-react";
import { createElement, JSX } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { spentTime } from "../../utils/spentTime";

type PlaceInfoDetailsRowProps = {
  icon: Icon;
  label: string;
  value: JSX.Element | string | number | null | undefined;
};

const PlaceInfoDetailsRow = ({
  icon,
  label,
  value,
}: PlaceInfoDetailsRowProps) => (
  <div className="place-info-details">
    {createElement(icon)}
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value || "N/A"}</div>
    </div>
  </div>
);

export const PlaceInfoDetails = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  return (
    <Row className="row-cols-1">
      <Col>
        <PlaceInfoDetailsRow
          icon={IconMessage}
          label="Extracted reviews"
          value={container?.totalReviews}
        />
      </Col>
      <Col>
        <PlaceInfoDetailsRow
          icon={IconMessageReply}
          label="Extracted owner replies"
          value={container?.totalOwnerReviews}
        />
      </Col>
      <Col>
        <PlaceInfoDetailsRow
          icon={IconCamera}
          label="Extracted images"
          value={container?.totalImages}
        />
      </Col>
      <Col>
        <PlaceInfoDetailsRow
          icon={IconVideo}
          label="Extracted videos"
          value={container?.totalVideos}
        />
      </Col>
      <Col>
        <PlaceInfoDetailsRow
          icon={IconStopwatch}
          label="Execution Duration"
          value={`${spentTime(container)}`}
        />
      </Col>
      <Col>
        <PlaceInfoDetailsRow
          icon={IconCoins}
          label="Total Cost"
          value={<Badge>{`${container?.totalSpentPoints} points`}</Badge>}
        />
      </Col>
    </Row>
  );
};
