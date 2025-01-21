import { limit } from "firebase/firestore";
import {
  Card,
  CardBody,
  Stack,
  CardTitle,
  FormCheck,
  Button,
  Form,
} from "react-bootstrap";
import {
  createDockerContainer,
  dockerContainers,
} from "../../services/dockerService";
import { useEffect, useState } from "react";
import { map, filter } from "rxjs";
import { IDockerContainer } from "../../types/dockerContainer";

export const ScrapExpectedPoints = ({
  containerId,
}: {
  containerId: string;
}) => {
  const [container, setContainer] = useState<IDockerContainer>();

  useEffect(() => {
    if (!containerId) return;

    const subscription = dockerContainers({ containerId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        console.log("-".repeat(50));
        console.log(data);
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  /**
   * Validation URL
   * @param e Form event
   */
  async function handleScrap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;
    target.classList.add("was-validated");
    if (!target.checkValidity()) return;

    try {
      const { id } = await createDockerContainer({
        ...container,
        url: container?.url,
        uid: container?.uid,
        type: "comments",
        limit: container?.limit || 10,
        sortBy: container?.sortBy || "Newest",
        extractImageUrls: container?.extractImageUrls || false,
        extractVideoUrls: container?.extractVideoUrls || false,
        extractOwnerResponse: container?.extractOwnerResponse || false,
      });
      console.log(id);
      // navigate(`/scrap/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardBody>
        <Stack gap={2}>
          <CardTitle className="place-info-title">Expected Points:</CardTitle>

          <Stack direction={"horizontal"} className="justify-content-between">
            Reviews
          </Stack>
        </Stack>
        <Form onSubmit={handleScrap} noValidate id="validateForm">
          <FormCheck
            className="mt-3"
            type="checkbox"
            id="terms"
            label={
              <>
                I agree to the{" "}
                <a href="#" target="_blank" rel="nooper noreferrer">
                  terms and conditions
                </a>
              </>
            }
          ></FormCheck>
          <Button variant="primary" className="w-100 mt-3" type="submit">
            Scrap
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
