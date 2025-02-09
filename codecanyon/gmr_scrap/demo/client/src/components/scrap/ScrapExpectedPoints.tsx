import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormCheck,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { filter, map } from "rxjs";
import {
  createDockerContainer,
  dockerContainers,
} from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

export const ScrapExpectedPoints = ({
  containerId,
}: {
  containerId: string;
}) => {
  const navigate = useNavigate();
  const [container, setContainer] = useState<IDockerContainer>();
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  useEffect(() => {
    if (!containerId) return;

    const subscription = dockerContainers({ containerId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  useEffect(() => {
    if (container?.machineId && container?.type === "comments") {
      navigate(`/reviews/${container?.machineId}`);
    }
  }, [container]);

  /**
   * Validation URL
   * @param e Form event
   */
  async function handleScrap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const { id } = await createDockerContainer({
        title: container?.title,
        rating: container?.rating,
        url: container?.url,
        reviews: container?.reviews,
        location: container?.location,
        address: container?.address,
        uid: container?.uid,
        type: "comments",
        limit: container?.limit || 10,
        sortBy: container?.sortBy || "Newest",
        extractImageUrls: container?.extractImageUrls || false,
        extractVideoUrls: container?.extractVideoUrls || false,
        extractOwnerResponse: container?.extractOwnerResponse || false,
      });
      navigate(`/scrap/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardBody>
        <CardTitle className="place-info-title">
          Expected Points: <strong>$125</strong>
        </CardTitle>
        <Form onSubmit={handleScrap} noValidate id="validateForm">
          <FormCheck
            className="mt-3"
            type="checkbox"
            id="terms"
            checked={isTermsChecked}
            onChange={(e) => setIsTermsChecked(e.target.checked)}
            label={
              <>
                I agree to the{" "}
                <a href="#" target="_blank" rel="nooper noreferrer">
                  terms and conditions
                </a>
              </>
            }
          ></FormCheck>
          <Button
            variant="primary"
            className="w-100 mt-3"
            type="submit"
            disabled={!isTermsChecked || !container?.rating}
            size="lg"
          >
            Scrap
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
