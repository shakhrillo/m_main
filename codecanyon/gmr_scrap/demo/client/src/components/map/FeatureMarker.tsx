import { IconPin } from "@tabler/icons-react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  featureId: string;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    featureId: string,
  ) => void;
};

export const FeatureMarker = ({
  position,
  featureId,
  onMarkerClick,
}: TreeMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId],
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
