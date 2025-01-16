import { Map, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

const ClusteredMarkers = ({
  locations,
}: {
  locations: { latitude: number; longitude: number }[];
}) => {
  const [selectedMarker, setSelectedMarker] = useState<{
    position: { lat: number; lng: number };
  } | null>(null);
  const map = useMap();

  const markers = useMemo(() => {
    if (!map) return [];
    return locations.map(({ latitude, longitude }) => {
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });

      marker.addListener("click", () => {
        setSelectedMarker({
          position: { lat: latitude, lng: longitude },
        });
      });

      return marker;
    });
  }, [locations, map]);

  useEffect(() => {
    if (!map || markers.length === 0) return;

    // Set map bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(({ latitude, longitude }) => {
      bounds.extend(new google.maps.LatLng(latitude, longitude));
    });

    map.fitBounds(bounds);

    const markerClusterer = new MarkerClusterer({
      markers,
      map,
    });

    return () => {
      markerClusterer.clearMarkers();
    };
  }, [map, markers, locations]);

  return (
    <>
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>Info window content</div>
        </InfoWindow>
      )}
    </>
  );
};

export const GoogleMap = ({
  locations,
}: {
  locations: { latitude: number; longitude: number }[];
}) => {
  return (
    <Map
      defaultZoom={10}
      gestureHandling={"greedy"}
      disableDefaultUI
      mapId={"4cc6e874aae3dd3"}
    >
      <ClusteredMarkers locations={locations} />
    </Map>
  );
};
