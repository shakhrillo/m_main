import { IconCircleCheck, IconCircleDashedCheck, IconMessageReply, IconPhoto, IconVideo } from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import { Badge, Col, FormLabel, Row, Stack } from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { useOutletContext } from "react-router-dom";
import { IUserInfo } from "../../types/userInfo";

/**
 * Scrap extract type component.
 * @param containerId Container ID.
 * @param container Container.
 * @returns Scrap extract type component.
 */
export const ScrapExtractType = ({ container }: {
  container: IDockerContainer;
}) => {
  const user = useOutletContext<IUserInfo>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [extractOptions, setExtractOptions] = useState({
    extractImageUrls: false,
    extractVideoUrls: false,
    extractOwnerResponse: false
  });

  useEffect(() => {
    if (
      typeof container.extractImageUrls === "boolean" && 
      typeof container.extractVideoUrls === "boolean" && 
      typeof container.extractOwnerResponse === "boolean"
    ) {
      setExtractOptions({
        extractImageUrls: container.extractImageUrls,
        extractVideoUrls: container.extractVideoUrls,
        extractOwnerResponse: container.extractOwnerResponse,
      });
    }
  }, [container.extractImageUrls, container.extractVideoUrls, container.extractOwnerResponse]);

  useEffect(() => {
    setIsDisabled(!container.rating || user?.uid !== container?.uid);
  }, [container, user?.uid]);

  const toggleOption = (key: keyof typeof extractOptions) => {
    if (isDisabled || !container.id ) return
    updateDockerContainer(container.id, { [key]: !extractOptions[key] }).catch((error) => {
      console.error("Error updating container:", error);
    });
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
                aria-disabled={isDisabled}>
                <div className="me-3">
                  {createElement(isActive ? IconCircleCheck : IconCircleDashedCheck, {
                    size: 30,
                  })}
                </div>
                <Stack direction="vertical">
                  <FormLabel>{label}</FormLabel>
                  <div className="mt-n2">
                    <Badge pill bg={isActive ? "success" : "secondary"}>{points} points</Badge>
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
