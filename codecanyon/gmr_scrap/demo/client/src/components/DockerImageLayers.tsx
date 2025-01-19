import { useEffect, useState } from "react";
import { Card, CardBody, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { dockerImageLayers } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";

export const DockerImageLayers = () => {
  const { imgId } = useParams() as { imgId: string };
  const [imageLayers, setImageLayers] = useState([] as any);

  useEffect(() => {
    const subscription = dockerImageLayers(imgId).subscribe((data) => {
      setImageLayers(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card>
      <CardBody>
        <Table hover responsive>
          <thead>
            <tr>
              <th>Created By</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {imageLayers.map((layer: any) => (
              <tr>
                <td>
                  <code>
                    <>{layer.CreatedBy}</>
                  </code>
                </td>
                <td>
                  <span className="d-inline-block text-nowrap">
                    {formatSize(layer.Size)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
