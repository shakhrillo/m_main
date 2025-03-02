import { useEffect, useState } from "react";
import {
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  FormText,
  Row,
  Stack,
} from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import type { IDockerContainer } from "../../types/dockerContainer";
import { useOutletContext } from "react-router-dom";
import type { IUserInfo } from "../../types/userInfo";
import { settingValue } from "../../services/settingService";
import { filter, take } from "rxjs";

interface IScrapExtractOptions {
  container: IDockerContainer;
}

interface IOptionCardProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Option card component.
 * @param label Label.
 * @param children Children.
 * @returns Option card component.
 */
const OptionCard = ({ label, children }: IOptionCardProps) => (
  <Col sm={6}>
    <Stack direction="horizontal" className="gap-3 align-items-start">
      <div className="w-100">
        <FormLabel>{label}</FormLabel>
        {children}
      </div>
    </Stack>
  </Col>
);

/**
 * Scrap extract options component.
 * @param containerId Container ID.
 * @param container Container.
 * @returns Scrap extract options component.
 */
export const ScrapExtractOptions = ({ container }: IScrapExtractOptions) => {
  const user = useOutletContext<IUserInfo>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(0);
  const [maxSpentPoints, setMaxSpentPoints] = useState<number>(
    user?.coinBalance || 0,
  );
  const [sortBy, setSortBy] = useState<
    "Most relevant" | "Newest" | "Highest rating" | "Lowest rating"
  >("Most relevant");
  const [outputAs, setOutputAs] = useState<"json" | "csv">("json");

  const [validateMin, setValidateMin] = useState<number>(0);
  const [validateMax, setValidateMax] = useState<number>(0);

  useEffect(() => {
    if (typeof container.limit === "number") {
      setLimit(container.limit);
    }

    if (typeof container.maxSpentPoints === "number") {
      if (container.maxSpentPoints > user?.coinBalance) {
        setMaxSpentPoints(user?.coinBalance);
      } else {
        setMaxSpentPoints(container.maxSpentPoints);
      }
    }
  }, [container?.limit, container?.maxSpentPoints, user]);

  useEffect(() => {
    if (container.sortBy) {
      setSortBy(container.sortBy);
    }
  }, [container?.sortBy]);

  useEffect(() => {
    if (container.outputAs) {
      setOutputAs(container.outputAs);
    }
  }, [container?.outputAs]);

  useEffect(() => {
    setIsDisabled(
      !container.rating ||
        user?.uid !== container?.uid ||
        user?.coinBalance <= 0,
    );
  }, [container, user]);

  useEffect(() => {

    const subscription = settingValue({ tag: "minimum", type: "scrap" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        if (data?.value) {
          setValidateMin(Number(data.value));

          if (limit < Number(data.value)) {
            setLimit(Number(data.value));
          }
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
          setValidateMax(Number(data.value));

          if (maxSpentPoints > Number(data.value)) {
            setMaxSpentPoints(Number(data.value));
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleFormChange = (key: string, value: any) => {
    if (isDisabled || !container.id) return;
    updateDockerContainer(container.id, { [key]: value }).catch((error) => {
      console.error("Error updating container:", error);
    });
  };

  return (
    <>
      <h5 className="mt-3 mb-0">Extract options</h5>
      <div className="scrap-extract-options">
        <Row className="g-3">
          <OptionCard label="Review limit">
            <FormControl
              placeholder="Review limit"
              disabled={isDisabled}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onBlur={(e) => {
                let value = Number(e.target.value);
                console.log(value, validateMin, validateMax);
                if (value < validateMin) {
                  value = validateMin;
                } else if (value > validateMax) {
                  value = validateMax;
                }
                setLimit(value);
                handleFormChange("limit", value);
              }}
              type="number"
              min={validateMin}
              max={validateMax}
            />
            <FormText>
              Maximum number of reviews to extract. Minimum: {validateMin},
              Maximum: {validateMax}.
            </FormText>
          </OptionCard>

          <OptionCard label="Max spent points">
            <FormControl
              placeholder="Max spent points"
              disabled={isDisabled}
              value={maxSpentPoints}
              type="number"
              onChange={(e) => setMaxSpentPoints(Number(e.target.value))}
              onBlur={(e) => {
                let value = Number(e.target.value);
                if (value < 0) {
                  value = 0;
                } else if (value > user?.coinBalance) {
                  value = user?.coinBalance;
                }
                setMaxSpentPoints(value);
                handleFormChange("maxSpentPoints", value);
              }}
            />
            <FormText>
              Maximum points to spend on this scrap. Max points you can spend:{" "}
              {validateMax < user?.coinBalance
                ? validateMax
                : user?.coinBalance}
              .
            </FormText>
          </OptionCard>

          <OptionCard label="Sort by">
            <FormSelect
              value={sortBy}
              disabled={isDisabled}
              onChange={(e) => handleFormChange("sortBy", e.target.value)}
              onBlur={(e) => handleFormChange("sortBy", e.target.value)}
            >
              {[
                "Most relevant",
                "Newest",
                "Highest rating",
                "Lowest rating",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormText>
              Sort reviews by most relevant, newest, highest rating, or lowest
              rating.
            </FormText>
          </OptionCard>

          <OptionCard label="Output as">
            <FormSelect
              disabled={isDisabled}
              value={outputAs}
              onChange={(e) => handleFormChange("outputAs", e.target.value)}
              onBlur={(e) => handleFormChange("outputAs", e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </FormSelect>
            <FormText>Output as a CSV or JSON file.</FormText>
          </OptionCard>
        </Row>
      </div>
    </>
  );
};
