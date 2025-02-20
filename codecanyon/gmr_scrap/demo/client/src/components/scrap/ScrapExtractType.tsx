import { IconCircleCheck, IconCircleDashedCheck, IconFence, IconMessageReply, IconPhoto, IconVideo } from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import { Badge, Card, CardBody, Col, Row } from "react-bootstrap";
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
      <Row>
        {options.map(({ key, label, icon, points }) => {
          const isActive = extractOptions[key as keyof typeof extractOptions];
          return (
            <Col key={key}>
              <Card role="button" onClick={() => toggleOption(key as keyof typeof extractOptions)}>
                <CardBody className="d-flex align-items-center">
                  {createElement(icon, { className: "text-body-secondary me-3", size: 30 })}
                  <div className="d-block me-auto">
                    <h6 className="m-0">{label}</h6>
                    <Badge className="d-inline" bg={isActive ? "success" : "secondary"}>{points} points</Badge>
                  </div>
                  {createElement(isActive ? IconCircleCheck : IconCircleDashedCheck, {
                    className: isActive ? "text-success" : "text-body-secondary",
                    size: 30,
                  })}
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
