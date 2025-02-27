import { useEffect, useState } from "react";
import { Col, FormControl, FormLabel, FormSelect, FormText, Row, Stack } from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { useOutletContext } from "react-router-dom";
import { IUserInfo } from "../../types/userInfo";

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
  const [maxSpentPoints, setMaxSpentPoints] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"Most relevant" | "Newest" | "Highest rating" | "Lowest rating">("Most relevant");
  const [outputAs, setOutputAs] = useState<"json" | "csv">("json");

  useEffect(() => {
    if (typeof container.limit === "number" && typeof container.maxSpentPoints === "number") {
      setLimit(container.limit);
      setMaxSpentPoints(container.maxSpentPoints);
    }
  }, [container?.limit, container?.maxSpentPoints]);

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
    setIsDisabled(!container.rating || user?.uid !== container?.uid);
  }, [container, user?.uid]);

  const handleFormChange = (key: string, value: any) => {
    if (isDisabled || !container.id) return;
    updateDockerContainer(container.id, { [key]: value }).catch((error) => {
      console.error("Error updating container:", error);
    });
  }

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
              onBlur={(e) => handleFormChange("limit", Number(e.target.value))}
            />
            <FormText>Limit the number of reviews to extract. Leave empty to extract all.</FormText>
          </OptionCard>

          <OptionCard label="Max spent points">
            <FormControl
              placeholder="Max spent points"
              disabled={isDisabled}
              value={maxSpentPoints}
              onChange={(e) => setMaxSpentPoints(Number(e.target.value))}
              onBlur={(e) => handleFormChange("maxSpentPoints", Number(e.target.value))}
            />
            <FormText>Maximum points to spend on this scrap.</FormText>
          </OptionCard>

          <OptionCard label="Sort by">
            <FormSelect
              value={sortBy}
              disabled={isDisabled}
              onChange={(e) => handleFormChange("sortBy", e.target.value)}
              onBlur={(e) => handleFormChange("sortBy", e.target.value)}
            >
              {["Most relevant", "Newest", "Highest rating", "Lowest rating"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormText>Sort reviews by most relevant, newest, highest rating, or lowest rating.</FormText>
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
