import type { Icon } from "@tabler/icons-react";
import {
  IconCamera,
  IconCoins,
  IconMapPins,
  IconMessage,
  IconMessageReply,
  IconStopwatch,
  IconVideo,
} from "@tabler/icons-react";
import type { JSX } from "react";
import { createElement } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import type { IDockerContainer } from "../../types/dockerContainer";
import { spentTime } from "../../utils/spentTime";

type DetailKey = keyof Pick<
  IDockerContainer,
  | "totalPlaces"
  | "totalReviews"
  | "totalOwnerReviews"
  | "totalImages"
  | "totalVideos"
  | "totalSpentPoints"
>;

const details: {
  icon: Icon;
  label: string;
  key: DetailKey | "spentTime";
  isBadge?: boolean;
}[] = [
  { icon: IconMapPins, label: "Total places", key: "totalPlaces" },
  { icon: IconMessage, label: "Extracted reviews", key: "totalReviews" },
  {
    icon: IconMessageReply,
    label: "Extracted owner replies",
    key: "totalOwnerReviews",
  },
  { icon: IconCamera, label: "Extracted images", key: "totalImages" },
  { icon: IconVideo, label: "Extracted videos", key: "totalVideos" },
  { icon: IconStopwatch, label: "Execution Duration", key: "spentTime" },
  {
    icon: IconCoins,
    label: "Total Cost",
    key: "totalSpentPoints",
    isBadge: true,
  },
];

/**
 * Place info details row component.
 * @param {Icon} icon - Icon.
 * @param {string} label - Label.
 * @param {JSX.Element | string | number | null | undefined} value - Value.
 * @returns {JSX.Element} Place info details row component.
 */
const PlaceInfoDetailsRow = ({
  icon,
  label,
  value,
}: {
  icon: Icon;
  label: string;
  value: JSX.Element | string | number | null | undefined;
}): JSX.Element => (
  <div className="place-info-details">
    {createElement(icon)}
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value || "N/A"}</div>
    </div>
  </div>
);

/**
 * Place info details component.
 * @param {IDockerContainer} container - Container.
 * @returns {JSX.Element} Place info details component.
 */
export const PlaceInfoDetails = ({
  container,
}: {
  container: IDockerContainer;
}): JSX.Element => (
  <Row className="row-cols-1">
    {details.filter(
      detail => {
        if (container?.type === "places") {
          return detail.key !== "totalReviews" && detail.key !== "totalOwnerReviews" && detail.key !== "totalImages" && detail.key !== "totalVideos";
        }
        return detail.key !== "totalPlaces";
      }
    ).map(({ icon, label, key, isBadge }) => (
      <Col key={key}>
        <PlaceInfoDetailsRow
          icon={icon}
          label={label}
          value={
            key === "spentTime" ? (
              spentTime(container)
            ) : isBadge ? (
              <Badge>{`${container[key as DetailKey] || 0} points`}</Badge>
            ) : (
              container[key as DetailKey]
            )
          }
        />
      </Col>
    ))}
  </Row>
);
