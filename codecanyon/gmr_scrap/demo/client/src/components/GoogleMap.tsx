import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { ClusteredMarkers } from "./map/ClusteredMarkers";
import { useRef } from "react";

export const GoogleMap = ({
  geojson,
}: {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(3);
  const [defaultZoom] = useState<number>(3);
  const [defaultCenter] = useState({
    lat: 20,
    lng: 20,
  });
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    geojson.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      bounds.extend({ lat, lng });
    });
    setBounds(bounds);
  }, [geojson, map]);

  useEffect(() => {
    if (!map || !bounds) return;
    map.fitBounds(bounds);
  }, [bounds, map]);

  return (
    <Map
      gestureHandling="greedy"
      mapId="4cc6e874aae3dd3"
      disableDefaultUI
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onZoomChanged={(e: MapCameraChangedEvent) => {
        setZoom(e.detail.zoom);
      }}
    >
      <ClusteredMarkers geojson={geojson} zoom={zoom} />
    </Map>
  );
};
