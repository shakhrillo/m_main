import React, { ElementType } from "react";
import { Card, CardBody, CardText, CardTitle, Stack } from "react-bootstrap";
import { formatNumber } from "../utils/formatNumber";

export const Statistics = ({
  icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) => {
  return (
    <Card>
      <CardBody>
        <Stack direction="horizontal" gap={3}>
          <div className="bg-primary-subtle text-primary p-3 rounded-circle">
            {React.createElement(icon)}
          </div>
          <Stack>
            <CardTitle className="fs-3 m-0">{formatNumber(value)}</CardTitle>
            <CardText>{label}</CardText>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};
