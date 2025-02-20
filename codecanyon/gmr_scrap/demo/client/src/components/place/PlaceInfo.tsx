import { IconBox, IconInfoCircle, IconSettings } from "@tabler/icons-react";
import { Accordion } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { locationsToGeoJSON } from "../../utils/locationsToGeoJSON";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";
import { StatusInfo } from "../StatusInfo";
import { NavLink } from "react-router-dom";
import { PlaceInfoDetails } from "./PlaceInfoDetails";

interface IPlaceInfoProps {
  container: IDockerContainer;
}

export const PlaceInfo = ({ container }: IPlaceInfoProps) => {
  return (
    <div className="place">
      {container.location && <GoogleMap geojson={locationsToGeoJSON([container.location])} />}
      {container.location && (
        <div className="place-info">
          <StatusInfo container={container} />
          {container.rating && <Ratings container={container} />}
          {container.type && (
            <h5>
              <NavLink
                to={`/${container.type === "info" ? "scrap" : "reviews"}/${container?.machineId}`}
              >
                {container.title || "N/A"}
              </NavLink>
            </h5>
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
              <h6 className="m-0">Extracted Data</h6>
            </Accordion.Header>
            <Accordion.Body>
              <PlaceInfoDetails container={container} />
            </Accordion.Body>
          </Accordion.Item>
        )}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <IconBox className="me-3" />
            <h6 className="m-0">Container Info</h6>
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoMachine container={container} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <IconSettings className="me-3" />
            <h6 className="m-0">Options</h6>
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoOptions container={container} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
