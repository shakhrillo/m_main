import type { JSX } from "react";
import { useEffect, useState } from "react";
import { dockerImage } from "../../services/dockerService";
import { IconTag, IconClock, IconDeviceSdCard, IconBrandUbuntu, IconHierarchy, IconTriangle } from "@tabler/icons-react";
import { Row, Col, Stack } from "react-bootstrap";
import { formatStringDate, formatTimestamp, formatSize } from "../../utils";

interface IDockerImageInfo {
  imageId: string;
}

type InfoRowProps = { icon: JSX.Element; label: string; value: JSX.Element | string | number };
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Stack direction="horizontal" gap={2}>
    {icon} <div><strong>{label}</strong><div>{value}</div></div>
  </Stack>
);

/**
 * DockerImageInfo component.
 * @param {string} imageId - The image ID.
 * @returns {JSX.Element} The DockerImageInfo component.
 */
export const DockerImageInfo = ({ imageId }: IDockerImageInfo): JSX.Element => {
  const [imageDetails, setImageDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const subscription = dockerImage(imageId).subscribe(setImageDetails);
    return () => subscription.unsubscribe();
  }, [imageId]);

  const rows = [
    { icon: <IconTag />, label: "Tags", value: imageDetails?.RepoTags?.join(", ") || "N/A" },
    { icon: <IconClock />, label: "Created", value: formatStringDate(imageDetails?.Created) },
    { icon: <IconClock />, label: "Updated", value: formatTimestamp(imageDetails?.updatedAt) },
    { icon: <IconDeviceSdCard />, label: "Size", value: formatSize(imageDetails?.Size || 0) },
    { icon: <IconBrandUbuntu />, label: "OS", value: imageDetails?.Os || "N/A" },
    { icon: <IconHierarchy />, label: "Architecture", value: imageDetails?.Architecture || "N/A" },
    { icon: <IconTriangle />, label: "Variant", value: imageDetails?.Variant || "N/A" },
  ];

  return (
    <div className="docker-image-info">
      <Row className="g-3 row-cols-1">
        {rows.map((row, idx) => (
          <Col key={idx}><InfoRow {...row} /></Col>
        ))}
      </Row>
    </div>
  );
};