import { IconCheck, IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { Statistics } from "../components/Statistics";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { formatDate } from "../utils/formatDate";
import { ContainersList } from "../components/containers/ContainersList";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerContainers = () => {
  const { uid } = useOutletContext<User>();
  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "Total Containers",
      icon: IconCheck,
      value: 10,
    },
  ];

  useEffect(() => {
    const subscription = dockerContainers().subscribe((data) => {
      console.log("___", data);
      setContainers(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {/*---Extracted reviews status---*/}
        {stats.map((stat, index) => (
          <Col key={index}>
            <Statistics {...stat} />
          </Col>
        ))}
        {/*---End: Extracted reviews status---*/}

        <Col xs={12}>
          <ContainersList path="containers" />
        </Col>
      </Row>
    </Container>
  );
};
