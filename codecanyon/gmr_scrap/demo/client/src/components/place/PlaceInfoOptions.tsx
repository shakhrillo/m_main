import { Row, Col } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { JSX } from "react";
import {
  IconArrowsSort,
  IconCamera,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

type PlaceInfoRowProps = {
  icon: JSX.Element;
  label: string;
  value: string | number | undefined;
};

const PlaceInfoRow = ({ icon, label, value }: PlaceInfoRowProps) => (
  <div className="d-flex align-items-center">
    {icon}
    <div className="ms-3">
      <div className="fw-bold">{label}</div>
      <div>{value ?? "N/A"}</div>
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
          icon={<IconPhoto />}
          label="Extract Images"
          value={container.extractImageUrls ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={<IconVideo />}
          label="Extract Images"
          value={container.extractVideoUrls ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={<IconMessageReply />}
          label="Extract Owner Replies"
          value={container.extractOwnerResponse ? "Yes" : "No"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={<IconFence />}
          label="Limit"
          value={container.limit || "Default"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={<IconArrowsSort />}
          label="Sort By"
          value={container.sortBy || "Default"}
        />
      </Col>
      <Col>
        <PlaceInfoRow
          icon={<IconFile />}
          label="Output Format"
          value={container.outputAs || "Default"}
        />
      </Col>
    </Row>
  );
};
