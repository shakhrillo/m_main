import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom"; // Hook for navigation
import { dockerContainerStats } from "../services/dockerService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { formatSize } from "../utils/formatSize";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerContainer = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const { containerId } = useParams() as { containerId: string };

  const [info, setInfo] = useState<any>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const containersSubscription = dockerContainerStats(containerId).subscribe(
      (data) => {
        console.log("stats->", data);
        setStats(data);
        setLoading(false);
      },
    );

    return () => {
      containersSubscription.unsubscribe();
    };
  }, [search, uid, filter]);

  useEffect(() => {
    const statsSubscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Table hover>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Network</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.id}>
                      <td>{formatTimestamp(stat?.updatedAt)}</td>
                      <td>
                        {formatSize(stat?.cpu_stats?.cpu_usage?.total_usage)}
                      </td>
                      <td>{formatSize(stat?.memory_stats?.usage)}</td>
                      <td>
                        {formatSize(
                          stat?.networks?.eth0?.rx_bytes +
                            stat?.networks?.eth0?.tx_bytes,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
