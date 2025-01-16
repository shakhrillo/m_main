import { Map, Marker } from "@vis.gl/react-google-maps";

export const GoogleMap = ({
  locations,
}: {
  locations: { latitude: number; longitude: number }[];
}) => {
  if (!location) return null;
  const defaultCenter = locations.reduce(
    (acc, location) => {
      acc.lat += location.latitude;
      acc.lng += location.longitude;
      return acc;
    },
    { lat: 0, lng: 0 },
  );

  return (
    <Map
      className="w-100 h-100"
      defaultCenter={{
        lat: defaultCenter.lat / locations.length,
        lng: defaultCenter.lng / locations.length,
      }}
      defaultZoom={18}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
          clickable={true}
          onClick={() => console.log("marker was clicked!")}
          title={"clickable google.maps.Marker"}
        />
      ))}
      {/* <Marker
        position={{
          lat: location?.latitude,
          lng: location?.longitude,
        }}
        clickable={true}
        onClick={() => console.log("marker was clicked!")}
        title={"clickable google.maps.Marker"}
      /> */}
    </Map>
  );
};
