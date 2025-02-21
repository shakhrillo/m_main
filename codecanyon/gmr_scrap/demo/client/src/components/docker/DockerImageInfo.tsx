import { JSX, useEffect, useState } from "react";
import { dockerImage } from "../../services/dockerService";
import { IconTag, IconClock, IconDeviceSdCard, IconBrandUbuntu, IconHierarchy, IconTriangle } from "@tabler/icons-react";
import { Row, Col, Card, CardBody } from "react-bootstrap";
import { formatStringDate, formatTimestamp, formatSize } from "../../utils";

interface IDockerImageInfo {
  imageId: string;
}

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

export const DockerImageInfo = ({ imageId }: IDockerImageInfo) => {
  const [imageDetails, setImageDetails] = useState({} as any);

  useEffect(() => {
    const subscription = dockerImage(imageId).subscribe((data) => {
      setImageDetails(data);
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <>
      <h5>Image Info</h5>

      <Card>
        <CardBody>
          <Row className="g-3 row-cols-1">
            <Col>
              <DockerImageInfoRow
                icon={<IconTag />}
                label="Tags"
                value={
                  imageDetails?.RepoTags
                    ? imageDetails?.RepoTags.join(", ")
                    : "N/A"
                }
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconClock />}
                label="Created"
                value={formatStringDate(imageDetails?.Created)}
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconClock />}
                label="Updated"
                value={formatTimestamp(imageDetails?.updatedAt)}
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconDeviceSdCard />}
                label="Size"
                value={formatSize(imageDetails?.Size || 0)}
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconBrandUbuntu />}
                label="OS"
                value={imageDetails?.Os || "N/A"}
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconHierarchy />}
                label="Architecture"
                value={imageDetails?.Architecture || "N/A"}
              />
            </Col>
            <Col>
              <DockerImageInfoRow
                icon={<IconTriangle />}
                label="Variant"
                value={imageDetails?.Variant || "N/A"}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
};