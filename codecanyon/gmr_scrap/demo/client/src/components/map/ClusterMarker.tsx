import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import type { JSX} from "react";
import { useCallback } from "react";

type TreeClusterMarkerProps = {
  clusterId: number;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    clusterId: number,
  ) => void;
  position: google.maps.LatLngLiteral;
  size: number;
  sizeAsText: string;
};

/**
 * ClusterMarker component
 * @param {number} clusterId - Cluster ID
 * @param {Function} onMarkerClick - Marker click handler
 * @param {google.maps.LatLngLiteral} position - Marker position
 * @param {number} size - Cluster size
 * @param {string} sizeAsText - Cluster size as text
 * @returns {JSX.Element} ClusterMarker component
 */
export const ClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId,
}: TreeClusterMarkerProps): JSX.Element => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId),
    [onMarkerClick, marker, clusterId],
  );
  const markerSize = Math.floor(48 + Math.sqrt(size) * 2);
  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={
        "bg-primary d-flex align-items-center justify-content-center rounded-circle shadow text-white"
      }
      style={{ width: markerSize, height: markerSize }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <p className="m-0 fw-bold">{sizeAsText}</p>
    </AdvancedMarker>
  );
};
