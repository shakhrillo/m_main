import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { ClusteredMarkers } from "./map/ClusteredMarkers";
const GOOGLE_MAPS_ID = import.meta.env.VITE_GOOGLE_MAPS_ID || "4cc6e874aae3dd3";

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

  useMemo(() => {
    if (!map || !bounds) return;

    const boundsJson = bounds.toJSON?.();
    if (!boundsJson) return;

    map.fitBounds(bounds);
  }, [
    map,
    bounds,
    bounds?.toJSON?.()?.west,
    bounds?.toJSON?.()?.south,
    bounds?.toJSON?.()?.east,
    bounds?.toJSON?.()?.north,
  ]);

  return (
    <Map
      gestureHandling="greedy"
      mapId={GOOGLE_MAPS_ID}
      disableDefaultUI
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onZoomChanged={(e: MapCameraChangedEvent) => {
        setZoom(e.detail.zoom);
      }}
      className="google-map"
    >
      <ClusteredMarkers geojson={geojson} zoom={zoom} />
    </Map>
  );
};
