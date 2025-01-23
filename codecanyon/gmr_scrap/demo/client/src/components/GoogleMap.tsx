import { useCallback, useEffect, useMemo, useState } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import {
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { FeatureMarker } from "./map/FeatureMarker";
import { FeaturesClusterMarker } from "./map/FeaturesClusterMarker";
import { BehaviorSubject, filter } from "rxjs";
const zoom$ = new BehaviorSubject<MapCameraChangedEvent>(null as any);

const ClusteredMarkers = ({
  geojson,
}: {
  geojson: FeatureCollection<Point, any>;
}) => {
  const [clusters, setClusters] = useState<any[]>([]);

  const clusterer = useMemo(() => {
    return new Supercluster({
      radius: 40,
      maxZoom: 16,
      extent: 256,
    });
  }, []);

  useEffect(() => {
    const subscription = zoom$
      .pipe(
        filter((zoom) => zoom !== null),
        filter(() => geojson !== null),
      )
      .subscribe((zoom) => {
        clusterer.load(geojson.features);
        const clustersData = clusterer.getClusters(
          [-180, -85, 180, 85],
          zoom.detail.zoom,
        );
        setClusters(clustersData);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [geojson, clusterer]);

  const getLeaves = useCallback(
    (clusterId: number) => clusterer.getLeaves(clusterId, Infinity),
    [clusterer],
  );

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      console.log("handleClusterClick", clusterId);
      const leaves = getLeaves(clusterId);

      // Zoom in
      const bounds = new google.maps.LatLngBounds();
      leaves.forEach((leaf) => {
        const [lng, lat] = leaf.geometry.coordinates;
        bounds.extend({ lat, lng });
      });
      console.log({ bounds, marker });
      // marker.getMap().fitBounds(bounds);

      console.log({ anchor: marker, features: leaves });
      // setInfowindowData({anchor: marker, features: leaves});
    },
    [getLeaves],
  );

  const handleMarkerClick = () => {};

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProperties.cluster;

        console.log("feature", feature);
        console.log("clusterProperties", clusterProperties);

        return isCluster ? (
          <FeaturesClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            onMarkerClick={handleClusterClick}
          />
        ) : (
          <FeatureMarker
            key={feature.id}
            featureId={feature.id as string}
            position={{ lat, lng }}
            onMarkerClick={handleMarkerClick}
          />
        );
      })}
    </>
  );
};

export const GoogleMap = ({
  geojson,
}: {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
}) => {
  console.log("geojson", geojson);
  return (
    <Map
      defaultZoom={10}
      gestureHandling="greedy"
      mapId="4cc6e874aae3dd3"
      // defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
      defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
      onZoomChanged={(zoom) => zoom$.next(zoom)}
    >
      <ClusteredMarkers geojson={geojson} />
    </Map>
  );
};
