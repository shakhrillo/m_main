import { IconPin } from "@tabler/icons-react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  feature: any;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    feature: any,
  ) => void;
};

export const FeatureMarker = ({
  position,
  feature,
  onMarkerClick,
}: TreeMarkerProps) => {
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
