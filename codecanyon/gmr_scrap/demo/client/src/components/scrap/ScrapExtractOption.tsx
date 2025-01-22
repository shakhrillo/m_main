import {
  IconArrowsSort,
  IconCheck,
  IconFence,
  IconFile,
  IconMessageReply,
  IconPhoto,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { createElement, useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormSelect,
  FormText,
} from "react-bootstrap";
import {
  getContainerSettings,
  updateContainerSettings,
} from "../../services/dockerService";
import { filter, take } from "rxjs";
import { IDockerContainer } from "../../types/dockerContainer";

export const ScrapExtractOption = ({
  option,
  container,
}: {
  container: IDockerContainer;
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [type, setType] = useState("");

  return (
    <Card>
      <CardBody
        className="d-flex bg-secondary align-items-start gap-3"
        onClick={() => {
          setIsSelected(!isSelected);
          // updateContainerSettings(containerId, type, {
          //   type: option.id,
          //   isSelected: !isSelected,
          // });
        }}
      >
        {createElement(option.icon, {
          className: "text-body-secondary",
        })}
        <span className="d-inline">
          {option.title}
          <Badge bg="secondary" className="ms-2">
            {option.points} points
          </Badge>
        </span>
        {isSelected ? (
          <IconCheck className="ms-auto" />
        ) : (
          <IconX className="ms-auto" />
        )}
      </CardBody>
    </Card>
  );
};
