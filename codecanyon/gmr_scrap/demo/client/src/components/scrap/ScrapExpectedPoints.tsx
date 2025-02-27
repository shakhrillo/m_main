import { useEffect, useState } from "react";
import { Button, Form, FormCheck } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

interface IScrapExpectedPoints {
  container: IDockerContainer;
}

/**
 * Scrap expected points component
 * @param containerId string
 * @returns JSX.Element
 */
export const ScrapExpectedPoints = ({ container }: IScrapExpectedPoints) => {
  const navigate = useNavigate();
  const [isTermsChecked, setIsTermsChecked] = useState(false);

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
        maxSpentPoints: container?.maxSpentPoints || 0,
      });
      navigate(`/reviews/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="scrap-expected-points">
      <Form onSubmit={handleScrap} noValidate>
        <FormCheck
          type="checkbox"
          id="terms"
          checked={isTermsChecked}
          onChange={(e) => setIsTermsChecked(e.target.checked)}
          label={
            <>
              I agree to the <NavLink to="/terms">terms and conditions</NavLink>
            </>
          }
        ></FormCheck>
        <Button variant="primary" className="w-100 mt-3" type="submit" disabled={!isTermsChecked || !container?.rating}>
          Scrap
        </Button>
      </Form>
    </div>
  );
};
