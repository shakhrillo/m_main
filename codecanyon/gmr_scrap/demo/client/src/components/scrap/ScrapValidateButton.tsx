import { IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button, Stack, Spinner, Badge } from "react-bootstrap";
import type { IDockerContainer } from "../../types/dockerContainer";
import { settingValue } from "../../services/settingService";
import { filter, take } from "rxjs";

interface IScrapValidateButton {
  container: IDockerContainer;
  containerId: string | undefined;
  isDisabled?: boolean;
}

export const ScrapValidateButton = ({
  container,
  containerId,
  isDisabled,
}: IScrapValidateButton) => {
  const [validationCost, setValidationCost] = useState<number>(0);

  useEffect(() => {
    settingValue({ tag: "validation", type: "coin" })
      .pipe(
        filter((data) => !!data?.value),
        take(1),
      )
      .subscribe((setting: any) => {
        setValidationCost(Number(setting?.value || 0));
      });
  }, []);

  return (
    <Button
      variant="primary"
      type="submit"
      className="ms-auto"
      disabled={isDisabled}
    >
      <Stack direction="horizontal" gap={2}>
        {container?.machine?.Action !== "die" && containerId ? (
          <>
            <Spinner animation="border" size="sm" />
            Validating URL...
          </>
        ) : (
          <>
            <IconCircleCheck />
            Validate URL
            <Badge pill bg="light" text="dark">
              {validationCost} points
            </Badge>
          </>
        )}
      </Stack>
    </Button>
  );
};
