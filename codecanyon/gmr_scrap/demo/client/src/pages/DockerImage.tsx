import { JSX, useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { map } from "rxjs";
import {
  IconBrandUbuntu,
  IconClock,
  IconDeviceSdCard,
  IconHierarchy,
  IconTag,
  IconTriangle,
} from "@tabler/icons-react";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { docker } from "../services/dockerService";
import { formatDate } from "../utils/formatDate";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";
import { formatTimestamp } from "../utils/formatTimestamp";

type DockerImageInfoRowProps = {
  icon: JSX.Element;
  label: string;
  value: JSX.Element | string | number;
};

const DockerImageInfoRow = ({
  icon,
  label,
  value,
}: DockerImageInfoRowProps) => (
  <div className="d-flex align-items-center">
    {icon}
    <div className="ms-3">
      <div className="text-break fw-bold">{label}</div>
      <div className="text-break">{value}</div>
    </div>
  </div>
);

export const DockerImage = () => {
  const { imgId } = useParams() as { imgId: string };
  const navigate = useNavigate();
  const [imageLayers, setImageLayers] = useState([] as any);
  const [imageDetails, setImageDetails] = useState({} as any);

  useEffect(() => {
    const subscription = docker({
      type: "image",
    })
      .pipe(
        map((data) => {
          const images = data
            .filter((image: any) => image.id === imgId)
            .map((image: any) => ({
              ...JSON.parse(typeof image.data === "string" ? image.data : "{}"),
              id: image.id,
              updatedAt: image.updatedAt,
            }));

          if (images.length) {
            return images[0];
          }

          return {};
        }),
      )
      .subscribe((data) => {
        setImageDetails(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [imgId]);

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
        setImageLayers(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item>Docker</Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/images");
          }}
        >
          Images
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {imageDetails.RepoTags?.[0] || imgId}
        </Breadcrumb.Item>
      </Breadcrumb>
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
          <Card>
            <CardBody>
              <CardTitle>Image Info</CardTitle>
              <Row className="g-3 row-cols-1">
                <Col>
                  <DockerImageInfoRow
                    icon={<IconTag />}
                    label="Tags"
                    value={
                      imageDetails.RepoTags
                        ? imageDetails.RepoTags.join(", ")
                        : "N/A"
                    }
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconClock />}
                    label="Created"
                    value={formatStringDate(imageDetails.Created)}
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconClock />}
                    label="Updated"
                    value={formatTimestamp(imageDetails.updatedAt)}
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconDeviceSdCard />}
                    label="Size"
                    value={formatSize(imageDetails.Size || 0)}
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconBrandUbuntu />}
                    label="OS"
                    value={imageDetails.Os || "N/A"}
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconHierarchy />}
                    label="Architecture"
                    value={imageDetails.Architecture || "N/A"}
                  />
                </Col>
                <Col>
                  <DockerImageInfoRow
                    icon={<IconTriangle />}
                    label="Variant"
                    value={imageDetails.Variant || "N/A"}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
