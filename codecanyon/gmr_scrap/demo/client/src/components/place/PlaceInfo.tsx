import { IconBox, IconInfoCircle, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { filter, map } from "rxjs";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { locationsToGeoJSON } from "../../utils/locationsToGeoJSON";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";
import { StatusInfo } from "../StatusInfo";
import { NavLink } from "react-router-dom";
import { PlaceInfoDetails } from "./PlaceInfoDetails";
import { getAuth } from "firebase/auth";

export const PlaceInfo = ({
  containerId,
}: {
  containerId: string | undefined;
}) => {
  const auth = getAuth();
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    if (!containerId || !auth.currentUser?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId,
      uid: auth.currentUser?.uid,
    })
    .pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        const containers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }));
        return containers[0];
      })
    )
    .subscribe((data) => {
      if (!data || !data.location) {
        setContainer({} as IDockerContainer);
        return;
      }
      setContainer(data);
      setGeojson(locationsToGeoJSON([data.location]));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId, auth.currentUser?.uid]);

  return (
    <div className="place">
      {geojson && <GoogleMap geojson={geojson} />}
      {containerId && (
        <div className="place-info">
          <StatusInfo container={container} />
          {container.rating && <Ratings container={container} />}
          {container.type && (
            <h3>
              <NavLink
                to={`/${container.type === "info" ? "scrap" : "reviews"}/${container?.machineId}`}
              >
                {container.title || "N/A"}
              </NavLink>
            </h3>
          )}
          <div className="d-flex mt-3">
            {container.address && (
              <i className="d-block">{container.address}</i>
            )}
          </div>
        </div>
      )}
      <Accordion defaultActiveKey="1" flush alwaysOpen>
        {(container?.totalReviews ||
          container?.totalOwnerReviews ||
          container?.totalImages ||
          container?.totalVideos) && (
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <IconInfoCircle className="me-3" />
              <h5 className="m-0">Extracted Data</h5>
            </Accordion.Header>
            <Accordion.Body>
              <PlaceInfoDetails container={container} />
            </Accordion.Body>
          </Accordion.Item>
        )}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <IconBox className="me-3" />
            <h5 className="m-0">Container Info</h5>
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoMachine container={container} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <IconSettings className="me-3" />
            <h5 className="m-0">Options</h5>
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoOptions container={container} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
