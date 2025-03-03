import type { Icon } from "@tabler/icons-react";
import {
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
import type { IDockerContainer } from "../../types/dockerContainer";

type PlaceInfoRowProps = {
  icon: Icon;
  label: string;
  value?: any;
};

/**
 * PlaceInfoRow component
 * @param {PlaceInfoRowProps} props
 * @param {Icon} props.icon
 * @param {string} props.label
 * @param {string | number} [props.value]
 * @returns {JSX.Element}
 */
const PlaceInfoRow = ({ icon, label, value }: PlaceInfoRowProps) => (
  <div className="place-info-details">
    {createElement(icon)}
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value ?? "N/A"}</div>
    </div>
  </div>
);

const infoRows: { icon: Icon; label: string; key: keyof IDockerContainer }[] = [
  { icon: IconPhoto, label: "Extract Images", key: "extractImageUrls" },
  { icon: IconVideo, label: "Extract Videos", key: "extractVideoUrls" },
  {
    icon: IconMessageReply,
    label: "Extract Owner Replies",
    key: "extractOwnerResponse",
  },
  { icon: IconFence, label: "Max Reviews", key: "limit" },
  { icon: IconCoins, label: "Max Spent Points", key: "maxSpentPoints" },
  { icon: IconArrowsSort, label: "Sort By", key: "sortBy" },
  { icon: IconFile, label: "Output Format", key: "outputAs" },
];

/**
 * PlaceInfoOptions component
 * @param {IDockerContainer} props.container
 * @returns {JSX.Element}
 */
export const PlaceInfoOptions = ({
  container,
}: {
  container: IDockerContainer;
}) => (
  <Row className="row-cols-1">
    {infoRows.map(({ icon, label, key }) => (
      <Col key={key}>
        <PlaceInfoRow
          icon={icon}
          label={label}
          value={container[key] || 'N/A'}
        />
      </Col>
    ))}
  </Row>
);
