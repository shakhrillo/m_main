import { Map, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

// Memoize the ClusteredMarkers component
const ClusteredMarkers = React.memo(
  ({ locations }: { locations: { latitude: number; longitude: number }[] }) => {
    const [selectedMarker, setSelectedMarker] = useState<{
      position: { lat: number; lng: number };
    } | null>(null);
    const map = useMap();

    const handleMarkerClick = useCallback(
      (latitude: number, longitude: number) => {
        setSelectedMarker({
          position: { lat: latitude, lng: longitude },
        });
      },
      [],
    );

    const markers = useMemo(() => {
      if (!map) return [];
      return locations.map(({ latitude, longitude }) => {
        const marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
        });

        marker.addListener("click", () =>
          handleMarkerClick(latitude, longitude),
        );
        return marker;
      });
    }, [locations, map, handleMarkerClick]);

    const bounds = useMemo(() => {
      if (!map || locations.length === 0) return null;
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(({ latitude, longitude }) => {
        bounds.extend(new google.maps.LatLng(latitude, longitude));
      });
      return bounds;
    }, [locations, map]);

    useEffect(() => {
      if (!map || !bounds) return;

      map.fitBounds(bounds);

      const markerClusterer = new MarkerClusterer({
        markers,
        map,
      });

      return () => {
        markerClusterer.clearMarkers();
      };
    }, [map, markers, bounds]);

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
  },
);

// Memoize the GoogleMap component
export const GoogleMap = React.memo(
  ({
    locations,
  }: {
    locations: { latitude: number; longitude: number }[] | undefined;
  }) => {
    console.log("GoogleMap render");
    return (
      <Map
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI
        mapId={"4cc6e874aae3dd3"}
      >
        {locations && <ClusteredMarkers locations={locations} />}
      </Map>
    );
  },
);
