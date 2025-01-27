import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import SyntaxHighlighter, { Light, PrismLight } from "react-syntax-highlighter";
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { map } from "rxjs";
import { DockerImageDetails } from "../components/DockerImageDetails";
import { docker } from "../services/dockerService";
import { formatDate } from "../utils/formatDate";
import { formatSize } from "../utils/formatSize";
import { formatTimestamp } from "../utils/formatTimestamp";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const DockerImage = () => {
  const { imgId } = useParams() as { imgId: string };
  const [imageLayers, setImageLayers] = useState([] as any);

  useEffect(() => {
    const subscription = docker({
      type: "layer",
      imageId: imgId,
    })
      .pipe(
        map((data) => {
          return data.map((layer: any) => ({
            ...JSON.parse(typeof layer.data === "string" ? layer.data : "{}"),
            id: layer.id,
            updatedAt: layer.updatedAt,
          }));
        }),
      )
      .subscribe((data) => {
        console.log("docker image layers", data);
        setImageLayers(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container fluid>
      <Row className="g-3">
        <Col md={9}>
          <Card>
            <CardBody>
              <CardTitle>Image Layers ({imageLayers.length})</CardTitle>
              <SyntaxHighlighter
                language="docker"
                style={a11yLight}
                className="border rounded bg-light"
              >
                {imageLayers
                  .map((layer: any) => {
                    return `${
                      typeof layer?.CreatedBy === "string"
                        ? layer.CreatedBy.replace(/\s+/g, " ")
                            .split("&&")
                            .join(" &&\n ")
                        : ""
                    }
# Created At: ${formatDate(layer.Created)}
# Size: ${formatSize(layer.Size)}
# Comment: ${layer.Comment || "N/A"}
# Tags: ${layer.Tags ? layer.Tags.join(", ") : "N/A"}
# Updated At: ${formatTimestamp(layer.updatedAt)}`;
                  })
                  .join("\n\n")}{" "}
              </SyntaxHighlighter>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <DockerImageDetails />
        </Col>
      </Row>
    </Container>
  );
};
