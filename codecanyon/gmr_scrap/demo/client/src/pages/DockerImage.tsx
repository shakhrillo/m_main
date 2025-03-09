import { useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { dockerContainerHistory } from "../services/dockerService";
import { formatDate } from "../utils/formatDate";
import { formatSize } from "../utils/formatSize";
import { formatTimestamp } from "../utils/formatTimestamp";
import { DockerImageInfo } from "../components/docker/DockerImageInfo";

/**
 * Docker image page component.
 */
export const DockerImage = () => {
  const { imgId } = useParams() as { imgId: string };
  const navigate = useNavigate();
  const [imageLayers, setImageLayers] = useState([] as any);

  useEffect(() => {
    if (!imgId) return;

    const subscription = dockerContainerHistory(imgId).subscribe((data) => {
      console.log(data);
      setImageLayers(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [imgId]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/images");
          }}
        >
          Images
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{imgId}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-3">
        <Col md={9}>
          <div className="docker-image-history">
            {
              imageLayers.length === 0 && (
                <div className="text-center">Loading...</div>
              )
            }
            <SyntaxHighlighter language="docker" style={a11yLight}>
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
          </div>
        </Col>
        <Col md={3}>
          <DockerImageInfo imageId={imgId} />
        </Col>
      </Row>
    </Container>
  );
};
