import { useEffect, useState } from "react";
import { Button, Form, FormCheck } from "react-bootstrap";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";
import type { IDockerContainer } from "../../types/dockerContainer";
import type { IUserInfo } from "../../types/userInfo";
import { settingValue } from "../../services/settingService";
import { filter, take } from "rxjs";

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
  const user = useOutletContext<IUserInfo>();
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [limit, setLimit] = useState<number>(0);
  const [maxSpentPoints, setMaxSpentPoints] = useState<number>(
    user?.coinBalance || 0,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (container?.machineId && container?.type === "comments") {
      navigate(`/reviews/${container?.machineId}`);
    }
  }, [container, navigate]);

  useEffect(() => {
    const subscription = settingValue({ tag: "minimum", type: "scrap" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        if (data?.value) {
          setLimit(Number(data.value));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = settingValue({ tag: "maximum", type: "scrap" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        if (data?.value) {
          setMaxSpentPoints(Number(data.value));
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleScrap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
        limit: container?.limit || limit,
        sortBy: container?.sortBy || "Most relevant",
        extractImageUrls: container?.extractImageUrls || false,
        extractVideoUrls: container?.extractVideoUrls || false,
        extractOwnerResponse: container?.extractOwnerResponse || false,
        maxSpentPoints: Math.min(
          container?.maxSpentPoints || maxSpentPoints || user?.coinBalance,
          user?.coinBalance,
        ),
        outputAs: container?.outputAs || "json",
      });
      navigate(`/reviews/${id}`);
    } catch (error) {
      const message = "An error occurred while scrapping the expected points.";
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scrap-expected-points">
      <Form onSubmit={handleScrap} noValidate className="w-100">
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
        <Button
          variant="primary"
          className="w-100 mt-3"
          type="submit"
          disabled={!isTermsChecked || !container?.rating || user?.coinBalance <= 0}
        >
          {loading ? "Loading..." : "Scrap"}
        </Button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Form>
    </div>
  );
};
