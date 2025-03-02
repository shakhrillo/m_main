import { useState, useMemo, useEffect, useCallback } from "react";
import type { ClusterProperties } from "supercluster";
import Supercluster from "supercluster";
import { FeatureMarker } from "./FeatureMarker";
import { ClusterMarker } from "./ClusterMarker";
import type { FeatureCollection, Point } from "geojson";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import type { IDockerContainer } from "../../types/dockerContainer";
import { NavLink } from "react-router-dom";

/**
 * ClusteredMarkers component
 * @param geojson GeoJSON data
 * @param zoom Current zoom level
 * @returns Clustered markers
 */
export const ClusteredMarkers = ({
  geojson,
  zoom,
}: {
  geojson: FeatureCollection<Point, any>;
  zoom: any;
}) => {
  const map = useMap();
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [selectedContainer, setSelectedContainer] =
    useState<IDockerContainer | null>(null);

  const clusterer = useMemo(() => {
    return new Supercluster({
      radius: 40,
      maxZoom: 16,
      extent: 256,
    });
  }, []);

  useEffect(() => {
    clusterer.load(geojson.features);
    const clusters = clusterer.getClusters([-180, -85, 180, 85], zoom);
    setClusterData(clusters);
  }, [geojson, clusterer, zoom]);

  const getClusterLeaves = useCallback(
    (clusterId: number) => clusterer.getLeaves(clusterId, Infinity),
    [clusterer],
  );

  const handleClusterMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      // Zoom in to the cluster
      const leaves = getClusterLeaves(clusterId);
      const bounds = new google.maps.LatLngBounds();
      leaves.forEach((leaf) => {
        const [lng, lat] = leaf.geometry.coordinates;
        bounds.extend({ lat, lng });
      });
      map?.fitBounds(bounds);
    },
    [getClusterLeaves, map],
  );

  const handleFeatureMarkerClick = (
    marker: any,
    container: IDockerContainer,
  ) => {
    setSelectedContainer(container);
    setSelectedMarker({
      lat: marker.position.lat,
      lng: marker.position.lng,
    });
  };

  return (
    <>
      {clusterData.map((feature, index) => {
        const [lng, lat] = feature.geometry.coordinates;
        const clusterProps = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProps.cluster;

        return isCluster ? (
          <ClusterMarker
            key={`cluster-${index}`}
            clusterId={clusterProps.cluster_id}
            position={{ lat, lng }}
            size={clusterProps.point_count}
            sizeAsText={String(clusterProps.point_count_abbreviated)}
            onMarkerClick={handleClusterMarkerClick}
          />
        ) : (
          <FeatureMarker
            key={`feature-${index}`}
            feature={feature}
            position={{ lat, lng }}
            onMarkerClick={handleFeatureMarkerClick}
          />
        );
      })}

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker}
          onCloseClick={() => setSelectedMarker(null)}
          headerContent={
            <NavLink to={`/reviews/${selectedContainer?.id}`}>
              {selectedContainer?.title}
            </NavLink>
          }
        >
          <div>{selectedContainer?.totalReviews} reviews</div>
        </InfoWindow>
      )}
    </>
  );
};
