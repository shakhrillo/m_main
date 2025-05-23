import { IconCircleCheck, IconCircleDashedCheck } from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import { Badge, Col, FormLabel, Row, Stack } from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import type { IDockerContainer } from "../../types/dockerContainer";
import { useOutletContext } from "react-router-dom";
import type { IUserInfo } from "../../types/userInfo";

/**
 * Scrap extract type component.
 * @param containerId Container ID.
 * @param container Container.
 * @returns Scrap extract type component.
 */
export const ScrapExtractType = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  const user = useOutletContext<IUserInfo>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [extractOptions, setExtractOptions] = useState({
    extractImageUrls: false,
    extractVideoUrls: false,
    extractOwnerResponse: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExtractOptions({
      extractImageUrls: container.extractImageUrls || false,
      extractVideoUrls: container.extractVideoUrls || false,
      extractOwnerResponse: container.extractOwnerResponse || false,
    });
  }, [
    container.extractImageUrls,
    container.extractVideoUrls,
    container.extractOwnerResponse,
  ]);

  useEffect(() => {
    setIsDisabled(
      !container.rating ||
        user?.uid !== container?.uid ||
        user?.coinBalance <= 0,
    );
  }, [container, user]);

  const toggleOption = (key: keyof typeof extractOptions) => {
    if (isDisabled || !container.id) return;
    setError(null);
    updateDockerContainer(container.id, { [key]: !extractOptions[key] }).catch(
      (error) => {
        let message = "An error occurred while updating the extract type.";
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(message);
        }
      },
    );
  };

  const options = [
    { key: "extractImageUrls", label: "Image URLs", points: 2 },
    { key: "extractVideoUrls", label: "Video URLs", points: 3 },
    { key: "extractOwnerResponse", label: "Owner response", points: 3 },
  ];

  return (
    <>
      <h5 className="mt-3 mb-0">Extract type</h5>
      <Row className="g-3">
        {options.map(({ key, label, points }) => {
          const isActive = extractOptions[key as keyof typeof extractOptions];
          return (
            <Col key={key} sm={4}>
              <div
                role="button"
                onClick={() => toggleOption(key as keyof typeof extractOptions)}
                className={`scrap-extract-type ${isActive ? "active" : ""}`}
                aria-disabled={isDisabled}
              >
                <div className="me-3">
                  {createElement(
                    isActive ? IconCircleCheck : IconCircleDashedCheck,
                    {
                      size: 30,
                    },
                  )}
                </div>
                <Stack direction="vertical">
                  <FormLabel>{label}</FormLabel>
                  <div className="mt-n2">
                    <Badge pill bg={isActive ? "success" : "secondary"}>
                      {points} points
                    </Badge>
                  </div>
                </Stack>
              </div>
            </Col>
          );
        })}
        {error && (
          <Col sm={12}>
            <p className="text-danger">{error}</p>
          </Col>
        )}
      </Row>
    </>
  );
};
