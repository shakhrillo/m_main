import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { useEffect, useState } from "react";
import { ClusteredMarkers } from "./map/ClusteredMarkers";
import { BehaviorSubject } from "rxjs";

const GOOGLE_MAPS_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

/**
 * GoogleMap component.
 * @param geojson GeoJSON data.
 * @param boundChanges Subject to emit bounds changes.
 * @param isFitBounds Whether to fit bounds.
 */
export const GoogleMap = ({
  geojson,
  boundChanges,
  isFitBounds = true,
}: {
  geojson?: FeatureCollection<Point, GeoJsonProperties> | null;
  boundChanges?: BehaviorSubject<google.maps.LatLngBounds | null>;
  isFitBounds?: boolean;
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(3);
  const defaultCenter = { lat: 20, lng: 20 };

  useEffect(() => {
    if (!map || !geojson || !geojson.features.length) return;

    const bounds = new google.maps.LatLngBounds();
    geojson.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      bounds.extend(new google.maps.LatLng(lat, lng));
    });

    if (isFitBounds) {
      map.fitBounds(bounds);
    }
  }, [geojson, map]);

  return (
    <Map
      gestureHandling="greedy"
      mapId={GOOGLE_MAPS_ID}
      disableDefaultUI
      defaultCenter={defaultCenter}
      defaultZoom={3}
      maxZoom={20}
      onZoomChanged={(e: MapCameraChangedEvent) => setZoom(e.detail.zoom)}
      className="google-map"
      onBoundsChanged={(e: MapCameraChangedEvent) => {
        if (boundChanges) {
          boundChanges.next(new google.maps.LatLngBounds(e.detail.bounds));
        }
      }}
    >
      {geojson && <ClusteredMarkers geojson={geojson} zoom={zoom} />}
    </Map>
  );
};
