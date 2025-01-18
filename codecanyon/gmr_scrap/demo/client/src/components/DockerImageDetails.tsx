import { useEffect, useState } from "react";
import { dockerImageDetails } from "../services/dockerService";
import { useParams } from "react-router-dom";
import {
  IconBrandAppleFilled,
  IconBrandDocker,
  IconBrandUbuntu,
  IconCpu,
  IconDeviceSdCard,
  IconTag,
  IconTexture,
} from "@tabler/icons-react";
import {
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Col,
  Row,
  Stack,
} from "react-bootstrap";
import { formatSize } from "../utils/formatSize";

export const DockerImageDetails = () => {
  const { imgId } = useParams() as { imgId: string };
  const [imageDetails, setImageDetails] = useState({} as any);

  useEffect(() => {
    const imageDetailsSubscription = dockerImageDetails(imgId).subscribe(
      (data) => {
        console.log("___image details->", data);
        setImageDetails(data);
        // setLoading(false);
      },
    );

    return () => {
      imageDetailsSubscription.unsubscribe();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <Stack direction={"horizontal"} gap={3}>
          <div className="rounded bg-primary-subtle p-2 text-primary">
            <IconBrandUbuntu />
          </div>
          <Stack>
            <CardTitle className="text-capitalize mb-1">
              {imageDetails.Os}
            </CardTitle>
            <CardSubtitle className="text-muted">
              {imageDetails.Architecture}
            </CardSubtitle>
          </Stack>
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack>
          <Row className="row-cols-1 g-2">
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconDeviceSdCard />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Size</strong>
                  <span>{formatSize(imageDetails.Size || 0)}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconCpu />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Variant</strong>
                  <span>{imageDetails.Variant || 0}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconBrandDocker />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Docker</strong>
                  <span>{imageDetails.DockerVersion || 0}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconTag />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Tags</strong>
                  <span className="d-flex flex-wrap">
                    {imageDetails.RepoTags &&
                      imageDetails.RepoTags.map((tag: string) => (
                        <span>{tag}</span>
                      ))}
                  </span>
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
};
