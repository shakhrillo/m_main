import { GeoPoint } from "firebase/firestore";

/**
 * Convert an array of locations to a GeoJSON FeatureCollection
 * @param locations Array of locations
 * @returns GeoJSON FeatureCollection
 */
export const locationsToGeoJSON = (locations: GeoPoint[]) => {
  const features = locations.map((location) => {
    const { latitude, longitude, ...properties } = location;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties,
    };
  });

  return {
    type: "FeatureCollection",
    features,
  };
};
