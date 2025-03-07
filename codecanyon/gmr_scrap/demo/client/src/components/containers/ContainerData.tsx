import { Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import type { IDockerContainer } from "../../types/dockerContainer";
import { formatTimestamp, formatNumber } from "../../utils";
import { Ratings } from "../Ratings";
import { StatusInfo } from "../StatusInfo";
import { ContainerInfo } from "./ContainerInfo";
import type { JSX } from "react";

interface IContainerData {
  container: IDockerContainer;
  path: "reviews" | "containers" | "scrap" | "images";
}

/**
 * ContainerData component
 * @param {IDockerContainer} container - Container data
 * @param {string} path - Path
 * @returns {JSX.Element} - ContainerData component
 */
export const ContainerData = ({
  container,
  path,
}: IContainerData): JSX.Element => {
  return (
    <div className="container-data">
      <Stack direction="horizontal" gap={2} className="justify-content-between">
        {path === "containers" ? (
          <ContainerInfo container={container} />
        ) : (
          <StatusInfo container={container} />
        )}
        <div className="container-time">
          {formatTimestamp(container.createdAt)}
        </div>
      </Stack>
      <NavLink to={`/${path}/${container.id}`}>
        {path === "containers" ? <>{container.title}</> : container.title}
      </NavLink>
      {path === "containers" && (
        <>
          <Stack direction="horizontal" gap={2} className="text-muted">
            {container?.machine?.Actor?.Attributes?.name && (
              <i className="text-capitalize">
                #{container?.machine?.Actor?.Attributes?.name}
              </i>
            )}
            {(container?.machine?.Actor?.Attributes?.execDuration || 0) +
              "s exec duration"}
          </Stack>
        </>
      )}
      {(path === "reviews" || path === "scrap") && (
        <>
          <Ratings container={container} />
          {container.type === "comments" && (
            <Stack direction="horizontal" gap={2} className="text-muted">
              <div>{formatNumber(container.totalReviews)} Reviews</div>
              <div>
                {formatNumber(container.totalOwnerReviews)} Owner Reviews
              </div>
              <div>{formatNumber(container.totalImages)} Images</div>
              <div>{formatNumber(container.totalVideos)} Videos</div>
            </Stack>
          )}
          {container.type === "info" && (
            <Stack direction="horizontal" gap={2} className="text-muted">
              <div>Limit: {container.limit}</div>
              <div>Sort by: {container.sortBy}</div>
              <div>
                Extract Images: {container.extractImageUrls ? "Yes" : "No"}
              </div>
              <div>
                Extract Videos: {container.extractVideoUrls ? "Yes" : "No"}
              </div>
              <div>
                Extract Owner Response:{" "}
                {container.extractOwnerResponse ? "Yes" : "No"}
              </div>
            </Stack>
          )}
        </>
      )}
      {path === "images" && (
        <Stack direction="horizontal" gap={2} className="text-muted">
          <div>{container?.machine?.Os}</div>
          <div>{container?.machine?.Architecture}</div>
          <div>{container?.machine?.Variant}</div>
          <div>{formatTimestamp(container?.machine?.Created)}</div>
        </Stack>
      )}
    </div>
  );
};
