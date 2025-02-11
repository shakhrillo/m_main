import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import { filter, map } from "rxjs";
import { DockerDetails } from "../components/DockerDetails";
import { docker } from "../services/dockerService";
import { camelCaseToSentence } from "../utils/camelCaseToSentence";
import { formatSize } from "../utils/formatSize";

function renderValue(key: string, value: any) {
  if (
    key.toLowerCase().includes("runtimes") ||
    key.toLowerCase().includes("warnings") ||
    key.toLowerCase().includes("plugins") ||
    JSON.stringify(value) === "{}" ||
    JSON.stringify(value) === "[]" ||
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  if (typeof value === "object") {
    if (key.toLowerCase().includes("driverstatus")) {
      return value.map((v: any[]) => {
        return <span className="d-flex">{`${v[0]}: ${v[1]}`}</span>;
      });
    }

    if (Array.isArray(value)) {
      return value.join("\n ");
    }

    return Object.entries(value).map(([k, v], index) => {
      return (
        <div key={index}>
          <span className="text-capitalize">{camelCaseToSentence(k)}</span>:{" "}
          {renderValue(k, v)}
        </div>
      );
    });
  }

  if (typeof value === "boolean" || typeof value === "string") {
    if (
      value.toString().toLowerCase() === "true" ||
      value.toString().toLowerCase() === "false"
    ) {
      return value.toString().toLowerCase() === "true" ? "Yes" : "No";
    }
  }

  if (typeof value === "number") {
    if (key.toLowerCase().includes("mem")) {
      return formatSize(value);
    }
    return value;
  }

  if (
    typeof value === "string" &&
    parseISO(value).toString() !== "Invalid Date"
  ) {
    return parseISO(value).toString();
  }

  return <span className="text-capitalize">{camelCaseToSentence(value)}</span>;
}

export const DockerInfo = () => {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const subscription = docker({
      type: "info",
    })
      .pipe(
        filter((data) => data && data.length > 0),
        map((data) => {
          return data[0];
        }),
        map(({ data }) => {
          return JSON.parse(data);
        }),
      )
      .subscribe((data) => {
        setInfo(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item>Docker</Breadcrumb.Item>
        <Breadcrumb.Item active>Docker info</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={9}>
          <Card>
            <CardBody>
              <Table hover responsive>
                <tbody>
                  {Object.entries(info).map(([key, value], index) => (
                    <tr key={index}>
                      <td>
                        <span className="text-capitalize text-nowrap">
                          {camelCaseToSentence(key)}
                        </span>
                      </td>
                      <td>{renderValue(key, value)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <DockerDetails info={info} />
        </Col>
      </Row>
    </Container>
  );
};
