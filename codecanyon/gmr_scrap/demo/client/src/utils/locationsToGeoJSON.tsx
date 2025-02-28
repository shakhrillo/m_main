import type { GeoPoint } from "firebase/firestore";
import type { FeatureCollection, GeoJsonProperties, Point } from "geojson";

/**
 * Convert an array of Firestore GeoPoint locations to a GeoJSON FeatureCollection
 * @param locations Array of GeoPoint locations
 * @returns GeoJSON FeatureCollection
 */
export const locationsToGeoJSON = (
  locations: GeoPoint[],
): FeatureCollection<Point, GeoJsonProperties> => {
  const features = locations.map((location) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [location.longitude, location.latitude], // Correct access to properties
    },
    properties: {},
  }));

  return {
    type: "FeatureCollection",
    features,
  };
};
