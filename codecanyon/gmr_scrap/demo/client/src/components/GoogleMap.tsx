import { Map, Marker } from "@vis.gl/react-google-maps";

export const GoogleMap = ({
  location,
}: {
  location: { latitude: number; longitude: number };
}) => {
  if (!location) return null;

  return (
    <Map
      className="w-100 h-100"
      defaultCenter={{
        lat: location?.latitude,
        lng: location?.longitude,
      }}
      defaultZoom={18}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      <Marker
        position={{
          lat: location?.latitude,
          lng: location?.longitude,
        }}
        clickable={true}
        onClick={() => console.log("marker was clicked!")}
        title={"clickable google.maps.Marker"}
      />
    </Map>
  );
};
