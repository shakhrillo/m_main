import { IconPin } from "@tabler/icons-react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import type { JSX} from "react";
import { useCallback } from "react";

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  feature: any;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    feature: any,
  ) => void;
};

/**
 * FeatureMarker component
 * @param {google.maps.LatLngLiteral} position - Marker position
 * @param {any} feature - Feature
 * @param {Function} onMarkerClick - Marker click handler
 * @returns {JSX.Element} FeatureMarker component
 */
export const FeatureMarker = ({
  position,
  feature,
  onMarkerClick,
}: TreeMarkerProps): JSX.Element => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, feature?.properties),
    [onMarkerClick, marker, feature],
  );

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      style={{ width: 48, height: 48 }}
      className="bg-primary d-flex align-items-center p-1 justify-content-center rounded-circle shadow"
    >
      <IconPin className="text-white" />
    </AdvancedMarker>
  );
};
