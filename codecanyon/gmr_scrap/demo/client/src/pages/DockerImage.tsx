import {
  IconArrowLeft,
  IconBrandAppleFilled,
  IconClockHour3,
  IconDeviceSdCard,
  IconGrid3x3,
  IconGridPattern,
  IconGridPatternFilled,
  IconInfoCircle,
  IconInfoOctagon,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
  IconSelectAll,
  IconTexture,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import {
  allContainers,
  allImages,
  dockerImage,
  dockerImageDetails,
  dockerImageLayers,
} from "../services/dockerService";
import { formatSize } from "../utils/formatSize";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerImage = ({ imageId }: { imageId: string }) => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const { imgId } = useParams() as { imgId: string };

  const [info, setInfo] = useState<any>({});
  const [image, setImage] = useState<any>({});
  const [imageLayers, setImageLayers] = useState<any[]>([]);
  const [imageDetails, setImageDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [activeTab, setActiveTab] = useState("images");

  const stats = [
    {
      label: "All comments",
      icon: IconMessages,
      value: info.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      value: info.totalOwnerReviews || "0",
    },
    {
      label: "User comments",
      icon: IconMessages,
      value: info.totalUserReviews || "0",
    },
    { label: "Images", icon: IconPhoto, value: info.totalImages || "0" },
  ];

  useEffect(() => {
    if (!imgId) return;

    const imageSubscription = dockerImage(imgId).subscribe((data) => {
      console.log("image->", data);
      setImage(data);
      setLoading(false);
    });

    const imagesSubscription = dockerImageLayers(imgId).subscribe((data) => {
      console.log("image layers->", data);
      setImageLayers(data);
      setLoading(false);
    });

    const imageDetailsSubscription = dockerImageDetails(imgId).subscribe(
      (data) => {
        console.log("image details->", data);
        setImageDetails(data);
        setLoading(false);
      },
    );

    return () => {
      imageSubscription.unsubscribe();
      imagesSubscription.unsubscribe();
      imageDetailsSubscription.unsubscribe();
    };
  }, [search, uid, filter, imgId]);

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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row className="g-3">
          {/* Table for displaying reviews based on active filter */}
          <Col md={9}>
            <Card>
              <CardBody>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="d-flex rounded p-2 bg-primary-subtle">
                    <IconSelectAll
                      className="text-primary"
                      size={24}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h6 className="m-0">
                      {(() => {
                        const repoTags = Object.entries(imageDetails).find(
                          ([key]) => key === "RepoTags",
                        )?.[1];

                        // If repoTags exists and is an array, join the elements into a string
                        return Array.isArray(repoTags)
                          ? repoTags.join(", ")
                          : "No RepoTags available";
                      })()}
                    </h6>
                    <Stack direction={"horizontal"} gap={1}>
                      <IconInfoCircle size={16} className="text-muted" />
                      <span className="text-muted">
                        {String(
                          Object.entries(imageDetails).find(
                            ([key]) => key === "Parent",
                          )?.[1],
                        )}
                      </span>
                    </Stack>
                  </div>
                </Stack>
                <Stack direction={"horizontal"} className="mt-4">
                  <Col md={3}>
                    <Stack className="p-3 border" gap={1}>
                      <Stack direction={"horizontal"}>
                        <span className="text-muted">Created At</span>
                      </Stack>
                      <Stack direction="horizontal" gap={1}>
                        <IconClockHour3 size={16} className="text-muted" />{" "}
                        <Stack direction={"horizontal"} gap={3}>
                          <Stack direction={"horizontal"} gap={1}>
                            {(() => {
                              const createdDate = Object.entries(
                                imageDetails,
                              ).find(([key]) => key === "Created")?.[1];
                              if (
                                typeof createdDate === "string" &&
                                createdDate
                              ) {
                                const date = new Date(createdDate);
                                return date.toISOString().split("T")[0];
                              }
                              return "";
                            })()}
                          </Stack>
                          <span>
                            {(() => {
                              const dateStr = "2025-01-08T12:06:42Z";
                              const date = new Date(dateStr);
                              const time = date.toLocaleTimeString("en-GB", {
                                hour12: false,
                              });
                              return time;
                            })()}
                          </span>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Col>
                  <Col md={3}>
                    <Stack className="p-3 border border-start-0" gap={1}>
                      <Stack direction={"horizontal"}>
                        <span className="text-muted">Updated At</span>
                      </Stack>
                      <Stack direction="horizontal" gap={1}>
                        <IconClockHour3 size={16} className="text-muted" />{" "}
                        {(() => {
                          const updatedAt = Object.entries(imageDetails).find(
                            ([key]) => key === "updatedAt",
                          )?.[1];

                          if (
                            updatedAt &&
                            (updatedAt as { seconds?: number }).seconds
                          ) {
                            const timestamp = (updatedAt as { seconds: number })
                              .seconds;
                            const date = new Date(timestamp * 1000);
                            const dateString = date.toISOString().split("T")[0];
                            const timeString = date.toLocaleTimeString(
                              "en-GB",
                              { hour12: false },
                            );

                            return (
                              <Stack direction={"horizontal"} gap={3}>
                                <span>{dateString}</span>
                                <span>{timeString}</span>
                              </Stack>
                            );
                          }
                          return <span>No date available</span>;
                        })()}
                      </Stack>
                    </Stack>
                  </Col>
                  <Col md={3}>
                    <Stack className="p-3 border border-start-0" gap={1}>
                      <span className="text-muted">Size</span>
                      <Stack direction={"horizontal"} gap={1}>
                        <IconDeviceSdCard size={16} className="text-muted" />{" "}
                        <Stack direction={"horizontal"} gap={1}>
                          {String(
                            (() => {
                              if (
                                typeof imageDetails === "object" &&
                                imageDetails !== null &&
                                "Size" in imageDetails &&
                                typeof (imageDetails as any).Size === "number"
                              ) {
                                const sizeInBytes = (imageDetails as any).Size;
                                const sizeInMB = sizeInBytes / 1048576;

                                if (sizeInMB > 999) {
                                  const sizeInGB = sizeInMB / 1024;
                                  return `${sizeInGB.toFixed(2)} GB`;
                                }
                                return `${sizeInMB.toFixed(2)} MB`;
                              }
                              return "0.00 MB";
                            })(),
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Col>
                  <Col md={3}>
                    <Stack className="p-3 border border-start-0" gap={1}>
                      <span className="text-muted">Parent ID</span>
                      <Stack direction={"horizontal"}>
                        {(() => {
                          const parentValue = Object.entries(imageDetails).find(
                            ([key]) => key === "Parent",
                          )?.[1];

                          // Ensure that we always return a valid ReactNode
                          if (parentValue) {
                            return (
                              <span
                                className="text-truncate"
                                style={{
                                  maxWidth: "200px",
                                  display: "inline-block",
                                }}
                              >
                                {parentValue}
                              </span>
                            );
                          } else {
                            return (
                              <span className="bg-black text-white px-2 rounded">
                                N/A
                              </span>
                            );
                          }
                        })()}
                      </Stack>
                    </Stack>
                  </Col>
                </Stack>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <CardBody>
                <Stack gap={2}>
                  <Stack direction={"horizontal"} gap={2}>
                    <div className="d-flex rounded p-2 bg-primary-subtle">
                      <IconBrandAppleFilled
                        className="text-primary"
                        size={24}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h6 className="m-0">
                        {String(
                          Object.entries(imageDetails).find(
                            ([key]) => key === "Os",
                          )?.[1] || "",
                        )}
                      </h6>
                      <Stack direction={"horizontal"} gap={1}>
                        <IconTexture size={16} className="text-muted" />
                        <span className="text-muted">
                          {String(
                            Object.entries(imageDetails).find(
                              ([key]) => key === "Architecture",
                            )?.[1] || "",
                          )}
                        </span>
                      </Stack>
                    </div>
                  </Stack>
                  <Stack direction={"horizontal"} gap={2}>
                    <Stack
                      className="border rounded px-2 py-1 w-50"
                      direction={"vertical"}
                    >
                      <span className="text-muted">Size</span>
                      <Stack direction={"horizontal"} gap={1}>
                        {String(
                          (() => {
                            if (
                              typeof imageDetails === "object" &&
                              imageDetails !== null &&
                              "Size" in imageDetails &&
                              typeof (imageDetails as any).Size === "number"
                            ) {
                              const sizeInBytes = (imageDetails as any).Size;
                              const sizeInMB = sizeInBytes / 1048576;

                              if (sizeInMB > 999) {
                                const sizeInGB = sizeInMB / 1024;
                                return `${sizeInGB.toFixed(2)} GB`;
                              }
                              return `${sizeInMB.toFixed(2)} MB`;
                            }
                            return "0.00 MB";
                          })(),
                        )}
                      </Stack>
                    </Stack>
                    <Stack
                      className="border rounded px-2 py-1 w-50"
                      direction={"vertical"}
                      gap={1}
                    >
                      <span className="text-muted">Parent</span>
                      <Stack direction={"horizontal"}>
                        {(() => {
                          const parentValue = Object.entries(imageDetails).find(
                            ([key]) => key === "Parent",
                          )?.[1];

                          // Ensure that we always return a valid ReactNode
                          if (parentValue) {
                            return (
                              <span
                                className="text-truncate"
                                style={{
                                  maxWidth: "200px",
                                  display: "inline-block",
                                }}
                              >
                                {parentValue}
                              </span>
                            );
                          } else {
                            return (
                              <span className="bg-black text-white px-2 rounded">
                                N/A
                              </span>
                            );
                          }
                        })()}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack direction={"horizontal"} gap={2}>
                    <Stack
                      className="border rounded px-2 py-1 w-50"
                      direction={"vertical"}
                    >
                      <span className="text-muted">Created At</span>
                      <Stack direction={"horizontal"} gap={1}>
                        <span>
                          {(() => {
                            const createdDate = Object.entries(
                              imageDetails,
                            ).find(([key]) => key === "Created")?.[1];
                            if (
                              typeof createdDate === "string" &&
                              createdDate
                            ) {
                              const date = new Date(createdDate);
                              return date.toISOString().split("T")[0];
                            }
                            return "";
                          })()}
                        </span>
                      </Stack>
                    </Stack>
                    <Stack
                      className="border rounded px-2 py-1 w-50"
                      direction={"vertical"}
                      gap={1}
                    >
                      <span className="text-muted">Updated At</span>
                      <Stack direction={"horizontal"}>
                        <span>
                          {String(
                            (() => {
                              const updatedAt = Object.entries(
                                imageDetails,
                              ).find(([key]) => key === "updatedAt")?.[1];
                              if (
                                updatedAt &&
                                (updatedAt as { seconds?: number }).seconds
                              ) {
                                const timestamp = (
                                  updatedAt as { seconds: number }
                                ).seconds;
                                const date = new Date(timestamp * 1000);
                                return date.toISOString().split("T")[0];
                              }
                              return "";
                            })(),
                          )}
                        </span>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
