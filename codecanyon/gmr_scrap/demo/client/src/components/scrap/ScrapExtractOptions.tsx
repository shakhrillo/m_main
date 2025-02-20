import { IconArrowsSort, IconCoins, IconFence, IconFile } from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import { Card, CardBody, Col, FormControl, FormLabel, FormSelect, FormText, Row, Stack } from "react-bootstrap";
import { updateDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";

interface IScrapExtractOptionsProps {
  containerId: string | undefined;
  container: IDockerContainer;
}

interface IOptionCardProps {
  icon: any;
  label: string;
  children: React.ReactNode;
}

/**
 * Option card component.
 * @param icon Icon.
 * @param label Label.
 * @param children Children.
 * @returns Option card component.
 */
const OptionCard = ({ icon, label, children }: IOptionCardProps) => (
  <Col sm={12}>
    <Card>
      <CardBody>
        <Stack direction="horizontal" className="gap-3 align-items-start">
          {createElement(icon, { className: "text-body-secondary", size: 30 })}
          <div className="w-100">
            <FormLabel>{label}</FormLabel>
            {children}
          </div>
        </Stack>
      </CardBody>
    </Card>
  </Col>
);

/**
 * Scrap extract options component.
 * @param containerId Container ID.
 * @param container Container.
 * @returns Scrap extract options component.
 */
export const ScrapExtractOptions = ({ containerId, container }: IScrapExtractOptionsProps) => {
  const [limit, setLimit] = useState(container.limit || 10);
  const [maxSpentPoints, setMaxSpentPoints] = useState(container.maxSpentPoints || 100);
  const [sortBy, setSortBy] = useState<"Most relevant" | "Newest" | "Highest rating" | "Lowest rating">(
    container.sortBy || "Most relevant"
  );
  const [outputAs, setOutputAs] = useState<"json" | "csv">(container.outputAs || "json");

  useEffect(() => {
    if (!container.rating || !container.id || !containerId) return;

    updateDockerContainer(container.id, { limit, maxSpentPoints, sortBy, outputAs }).catch((error) =>
      console.error("Error updating container:", error)
    );
  }, [container.id, container.rating, containerId, limit, maxSpentPoints, sortBy, outputAs]);

  return (
    <>
      <h5 className="mt-3 mb-0">Extract options</h5>
      <Row className="g-3">
        <OptionCard icon={IconFence} label="Review limit">
          <FormControl
            placeholder="Review limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            disabled={!container.rating}
          />
          <FormText>Limit the number of reviews to extract. Leave empty to extract all.</FormText>
        </OptionCard>

        <OptionCard icon={IconCoins} label="Max spent points">
          <FormControl
            placeholder="Max spent points"
            value={maxSpentPoints}
            onChange={(e) => setMaxSpentPoints(Number(e.target.value))}
            disabled={!container.rating}
          />
          <FormText>Maximum points to spend on this scrap.</FormText>
        </OptionCard>

        <OptionCard icon={IconArrowsSort} label="Sort by">
          <FormSelect
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "Most relevant" | "Newest" | "Highest rating" | "Lowest rating")
            }
            disabled={!container.rating}
          >
            {["Most relevant", "Newest", "Highest rating", "Lowest rating"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
          <FormText>Sort reviews by most relevant, newest, highest rating, or lowest rating.</FormText>
        </OptionCard>

        <OptionCard icon={IconFile} label="Output as">
          <FormSelect
            value={outputAs}
            onChange={(e) => setOutputAs(e.target.value as "json" | "csv")}
            disabled={!container.rating}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </FormSelect>
          <FormText>Output as a CSV or JSON file.</FormText>
        </OptionCard>
      </Row>
    </>
  );
};
