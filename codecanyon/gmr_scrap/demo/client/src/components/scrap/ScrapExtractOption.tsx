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

export const ScrapExtractOption = ({
  option,
  containerId,
}: {
  option: any;
  containerId: string;
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const subscription = getContainerSettings(containerId, option.id)
      .pipe(
        filter((settings) => !!settings && !!settings.id),
        take(1),
      )
      .subscribe((settings) => {
        setType(settings.id);
        setIsSelected(settings.isSelected);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  return (
    <Card>
      <CardBody
        className="d-flex align-items-start gap-3"
        onClick={() => {
          setIsSelected(!isSelected);
          updateContainerSettings(containerId, type, {
            type: option.id,
            isSelected: !isSelected,
          });
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
