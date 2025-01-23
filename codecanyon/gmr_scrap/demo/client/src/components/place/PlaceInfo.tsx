import { IconBox, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { map } from "rxjs";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { locationsToGeoJSON } from "../../utils/locationsToGeoJSON";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";

export const PlaceInfo = ({ containerId }: { containerId: string }) => {
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    if (!containerId) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({ containerId })
      .pipe(map((data) => (Array.isArray(data) ? data[0] : null)))
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
  }, [containerId]);

  return (
    <div className="place">
      {geojson && <GoogleMap geojson={geojson} />}
      <div className="place-info">
        <h3>{container.title || "N/A"}</h3>
        {container.rating && <Ratings container={container} />}
      </div>
      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <IconBox className="me-3" />
            Container Info
          </Accordion.Header>
          <Accordion.Body>
            <PlaceInfoMachine container={container} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <IconSettings className="me-3" />
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
