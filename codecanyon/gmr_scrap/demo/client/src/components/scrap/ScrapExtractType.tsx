import { IconCircleCheck, IconCircleDashedCheck, IconMessageReply, IconPhoto, IconVideo } from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import { Badge, Col, FormLabel, Row, Stack } from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

/**
 * Scrap extract type component.
 * @param containerId Container ID.
 * @param container Container.
 * @returns Scrap extract type component.
 */
export const ScrapExtractType = ({ containerId, container }: {
  containerId: string | undefined;
  container: IDockerContainer;
}) => {
  const [extractOptions, setExtractOptions] = useState({
    extractImageUrls: container.extractImageUrls || false,
    extractVideoUrls: container.extractVideoUrls || false,
    extractOwnerResponse: container.extractOwnerResponse || false,
  });

  useEffect(() => {
    setExtractOptions({
      extractImageUrls: container.extractImageUrls || false,
      extractVideoUrls: container.extractVideoUrls || false,
      extractOwnerResponse: container.extractOwnerResponse || false,
    });
  }, [container]);

  useEffect(() => {
    if (!container.rating || !container.id || !containerId) return;

    console.log("Updating container:", container.id, extractOptions);
    updateDockerContainer(container.id, extractOptions).catch((error) => {
      console.error("Error updating container:", error);
    });
  }, [container, extractOptions]);

  const toggleOption = (key: keyof typeof extractOptions) => {
    if (container.rating) {
      setExtractOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const options = [
    { key: "extractImageUrls", label: "Image URLs", icon: IconPhoto, points: 2 },
    { key: "extractVideoUrls", label: "Video URLs", icon: IconVideo, points: 3 },
    { key: "extractOwnerResponse", label: "Owner response", icon: IconMessageReply, points: 3 },
  ];

  return (
    <>
      <h5 className="mt-3 mb-0">
        Extract type
      </h5>
      <Row className="g-3">
        {options.map(({ key, label, icon, points }) => {
          const isActive = extractOptions[key as keyof typeof extractOptions];
          return (
            <Col key={key} sm={4}>
              <div role="button" onClick={() => toggleOption(key as keyof typeof extractOptions)} 
                className={`scrap-extract-type ${isActive ? "active" : ""}`}
                aria-disabled={!container.rating}>
                <div className="me-3">
                  {createElement(isActive ? IconCircleCheck : IconCircleDashedCheck, {
                    size: 30,
                  })}
                </div>
                <Stack direction="vertical">
                  <FormLabel>{label}</FormLabel>
                  <div className="mt-n2">
                    <Badge pill>{points} points</Badge>
                  </div>
                </Stack>
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
