import {
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
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

export const DockerImage = () => {
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
          <Col>
            <Card>
              <CardBody>
                <Stack direction={"horizontal"} className="border-bottom">
                  <button
                    onClick={() => setActiveTab("images")}
                    className={`border-0 bg-transparent px-3 py-2 ${activeTab === "images" ? "border-bottom border-black" : ""}`}
                    type="button"
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`border-0 bg-transparent px-3 py-2 ${activeTab === "details" ? "border-bottom border-black" : ""}`}
                    type="button"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab("layers")}
                    className={`border-0 bg-transparent px-3 py-2 ${activeTab === "layers" ? "border-bottom border-black" : ""}`}
                    type="button"
                  >
                    Layers
                  </button>
                </Stack>
                {activeTab === "images" ? (
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(image).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td style={{ maxWidth: "400px" }}>
                            {Array.isArray(value) ? (
                              <ul>
                                {value.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : typeof value === "object" && value !== null ? (
                              <pre>{JSON.stringify(value, null, 2)}</pre>
                            ) : (
                              value?.toString() || "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : activeTab === "details" ? (
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(imageDetails).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td style={{ maxWidth: "400px" }}>
                            {Array.isArray(value) ? (
                              <ul>
                                {value.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : typeof value === "object" && value !== null ? (
                              <pre>{JSON.stringify(value, null, 2)}</pre>
                            ) : (
                              value?.toString() || "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Table hover>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Id</th>
                        <th scope="col">Tags</th>
                        <th scope="col">Created By</th>
                        <th scope="col">Size</th>
                        <th scope="col">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imageLayers.map((layer, index) => (
                        <tr key={index}>
                          <td scope="row" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>
                            <span
                              style={{ maxWidth: "200px" }}
                              className="text-truncate d-inline-block"
                            >
                              {layer.Id}
                            </span>
                          </td>
                          <td>
                            {layer.Tags
                              ? layer.Tags.map((tag: string) => (
                                  <div key={tag}>{tag}</div>
                                ))
                              : "No tags available"}
                          </td>
                          <td>{layer.createdBy}</td>
                          <td>{formatSize(layer.Size)}</td>
                          <td>{formatTimestamp(layer.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                {/* <Tabs
                  defaultActiveKey="image"
                  id="docker-image-tabs"
                  className="mb-3"
                >
                  <Tab eventKey="image" title="Image">
                    <Table hover>
                      <thead>
                        <tr>
                          <th scope="col">Key</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(image).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td style={{ maxWidth: "400px" }}>
                              {Array.isArray(value) ? (
                                <ul>
                                  {value.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              ) : typeof value === "object" &&
                                value !== null ? (
                                <pre>{JSON.stringify(value, null, 2)}</pre>
                              ) : (
                                value?.toString() || "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey="details" title="Details">
                    <Table hover>
                      <thead>
                        <tr>
                          <th scope="col">Key</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(imageDetails).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td style={{ maxWidth: "400px" }}>
                              {Array.isArray(value) ? (
                                <ul>
                                  {value.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              ) : typeof value === "object" &&
                                value !== null ? (
                                <pre>{JSON.stringify(value, null, 2)}</pre>
                              ) : (
                                value?.toString() || "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey="layers" title="Layers">
                    <Table hover>
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Id</th>
                          <th scope="col">Tags</th>
                          <th scope="col">Created By</th>
                          <th scope="col">Size</th>
                          <th scope="col">Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {imageLayers.map((layer, index) => (
                          <tr key={index}>
                            <td scope="row" style={{ width: "40px" }}>
                              {index + 1}
                            </td>
                            <td>
                              <span
                                style={{ maxWidth: "200px" }}
                                className="text-truncate d-inline-block"
                              >
                                {layer.Id}
                              </span>
                            </td>
                            <td>
                              {layer.Tags
                                ? layer.Tags.map((tag: string) => (
                                    <div key={tag}>{tag}</div>
                                  ))
                                : "No tags available"}
                            </td>
                            <td>{layer.createdBy}</td>
                            <td>{formatSize(layer.Size)}</td>
                            <td>{formatTimestamp(layer.updatedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
