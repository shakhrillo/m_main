import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { useEffect, useState } from "react";
import { ClusteredMarkers } from "./map/ClusteredMarkers";
import { BehaviorSubject } from "rxjs";

const GOOGLE_MAPS_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

export const GoogleMap = ({
  geojson,
  boundChanges,
}: {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
  boundChanges?: BehaviorSubject<google.maps.LatLngBounds | null>;
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(3);
  const defaultCenter = { lat: 20, lng: 20 };
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  useEffect(() => {
    if (!map || !geojson.features.length) return;

    const bounds = new google.maps.LatLngBounds();
    geojson.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      bounds.extend(new google.maps.LatLng(lat, lng));
    });

    setBounds(bounds);
    map.fitBounds(bounds);
  }, [geojson, map]);

  useEffect(() => {
    if (!map || !bounds) return;
    map.fitBounds(bounds);
  }, [map, bounds]);

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
      <ClusteredMarkers geojson={geojson} zoom={zoom} />
    </Map>
  );
};
