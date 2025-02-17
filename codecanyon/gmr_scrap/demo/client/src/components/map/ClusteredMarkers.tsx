import { useState, useMemo, useEffect, useCallback } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import { FeatureMarker } from "./FeatureMarker";
import { FeaturesClusterMarker } from "./FeaturesClusterMarker";
import { FeatureCollection, Point } from "geojson";
import { useMap } from "@vis.gl/react-google-maps";

export const ClusteredMarkers = ({ geojson, zoom }: { geojson: FeatureCollection<Point, any>; zoom: any;}) => {
  const map = useMap();
  const [clusters, setClusters] = useState<any[]>([]);

  const clusterer = useMemo(() => {
    return new Supercluster({
      radius: 40,
      maxZoom: 16,
      extent: 256,
    });
  }, []);

  useEffect(() => {
    clusterer.load(geojson.features);
    const clustersData = clusterer.getClusters([-180, -85, 180, 85], zoom);
    setClusters(clustersData);
  }, [geojson, clusterer, zoom]);

  const getLeaves = useCallback(
    (clusterId: number) => clusterer.getLeaves(clusterId, Infinity),
    [clusterer],
  );

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      // Zoom in to the cluster
      const leaves = getLeaves(clusterId);
      const bounds = new google.maps.LatLngBounds();
      leaves.forEach((leaf) => {
        const [lng, lat] = leaf.geometry.coordinates;
        bounds.extend({ lat, lng });
      });
      map?.fitBounds(bounds);
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
