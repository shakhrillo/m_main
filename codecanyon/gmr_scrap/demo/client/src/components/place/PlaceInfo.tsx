import { IconBox, IconInfoCircle, IconSettings } from "@tabler/icons-react";
import { Accordion } from "react-bootstrap";
import type { IDockerContainer } from "../../types/dockerContainer";
import { locationsToGeoJSON } from "../../utils/locationsToGeoJSON";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";
import { StatusInfo } from "../StatusInfo";
import { NavLink } from "react-router-dom";
import { PlaceInfoDetails } from "./PlaceInfoDetails";

interface IPlaceInfo {
  container: IDockerContainer;
}

/**
 * Place info component.
 * @param {IDockerContainer} container - Container.
 * @returns {JSX.Element} Place info component.
 */
export const PlaceInfo = ({ container }: IPlaceInfo) => {
  return (
    <div className="place">
      {container.location && (
        <GoogleMap geojson={locationsToGeoJSON([container])} />
      )}
      {container.location && (
        <div className="place-info">
          <StatusInfo container={container} />
          {container.rating && <Ratings container={container} />}
          {container.type && (
            <NavLink
              className="place-title"
              to={`/${container.type === "info" ? "scrap" : "reviews"}/${container?.machineId}`}
            >
              {container.title || "N/A"}
            </NavLink>
          )}
          {container.address && <i className="d-block">{container.address}</i>}
        </div>
      )}
      <Accordion
        defaultActiveKey="1"
        flush
        alwaysOpen
        className="place-accordion"
      >
        {(container?.totalReviews ||
          container?.totalOwnerReviews ||
          container?.totalImages ||
          container?.totalVideos) && (
          <Accordion.Item eventKey="0">
            <Accordion.Header className="place-accordion-header">
              <IconInfoCircle />
              Extracted Data
            </Accordion.Header>
            <Accordion.Body>
              <PlaceInfoDetails container={container} />
            </Accordion.Body>
          </Accordion.Item>
        )}
        <Accordion.Item eventKey="1">
          <Accordion.Header className="place-accordion-header">
            <IconBox />
            Container Info
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoMachine container={container} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header className="place-accordion-header">
            <IconSettings />
            Options
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoOptions container={container} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
