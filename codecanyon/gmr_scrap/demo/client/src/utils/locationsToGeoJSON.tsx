import type { FeatureCollection, GeoJsonProperties, Point } from "geojson";

/**
 * Convert an array of Firestore GeoPoint locations to a GeoJSON FeatureCollection
 * @param locations Array of GeoPoint locations
 * @returns GeoJSON FeatureCollection
 */
export const locationsToGeoJSON = (
  data: any[],
): FeatureCollection<Point, GeoJsonProperties> => {
  const features = data.map((container) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [
        container?.location?.longitude,
        container?.location?.latitude,
      ],
    },
    properties: container,
  }));

  return {
    type: "FeatureCollection",
    features,
  };
};
