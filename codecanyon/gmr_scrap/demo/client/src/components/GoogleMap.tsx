import { useEffect, useRef, useState } from "react";

export const GoogleMap = ({
  locations,
}: {
  locations: { latitude: number; longitude: number }[];
}) => {
  // Handle empty locations array
  if (!locations || locations.length === 0) return null;

  const mapRef = useRef<HTMLDivElement | null>(null); // Ref for accessing the map container
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        zoom: 18, // Default zoom level
        center: {
          lat: locations[0].latitude,
          lng: locations[0].longitude,
        },
        gestureHandling: "greedy",
        disableDefaultUI: true,
      });

      setMapInstance(googleMap);
    }
  }, [mapRef, mapInstance, locations]);

  // Add markers once the map instance is created
  useEffect(() => {
    if (mapInstance) {
      const bounds = new window.google.maps.LatLngBounds();

      // Create and add markers
      locations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(
            location.latitude,
            location.longitude,
          ),
          map: mapInstance, // Add marker to map instance
          title: "Clickable google.maps.Marker",
        });

        bounds.extend(marker.getPosition()!); // Extend bounds to include the marker
      });

      // Adjust the map to fit the bounds of all markers
      mapInstance.fitBounds(bounds);
    }
  }, [locations, mapInstance]);

  return (
    <div
      ref={mapRef}
      className="w-100 h-100"
      style={{ position: "relative", height: "100%", width: "100%" }}
    />
  );
};
