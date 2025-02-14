import { IconCoin, IconLabel, IconMail, IconStars } from "@tabler/icons-react";
import { Buffer } from "buffer";
import { JSX, useCallback, useEffect, useState } from "react";
import { Breadcrumb, Card, CardBody, CardTitle, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFile } from "../services/uploadService";
import { updateUser, userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { IUserInfo } from "../types/userInfo";

interface ChangeUserPhotoEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget;
}

const UserInfo = ({ icon, label, value }: { icon: JSX.Element; label: string; value?: any }) => (
  <div className="d-flex align-items-center">
    <span>{icon}</span>
    <div className="ms-3">
      <div className="text-break fw-bold">{value || "N/A"}</div>
      <div className="text-break">{label}</div>
    </div>
  </div>
);

export const User = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [buffer, setBuffer] = useState<Buffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const subscription = userData(userId).subscribe((data) => {
      setUser(data as IUserInfo);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  const handleFileChange = useCallback((event: ChangeUserPhotoEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      setBuffer(Buffer.from(new Uint8Array(arrayBuffer)));
    };
    reader.onerror = (err) => console.error("Error reading the file:", err);
    reader.readAsArrayBuffer(file);
  }, []);

  useEffect(() => {
    if (!buffer || !userId) return;

    const uploadPhoto = async () => {
      try {
        const photoURL = await uploadFile(buffer, "users");
        await updateUser(userId, { photoURL });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    uploadPhoto();
  }, [buffer, userId]);

  const handleUpdate = useCallback(
    (field: string, value: any) => {
      if (!userId) return;
      updateUser(userId, { [field]: value });
    },
    [userId]
  );

  if (loading) return <p>Loading user data...</p>;

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/users")}>Users</Breadcrumb.Item>
        <Breadcrumb.Item active>{user?.displayName || "User"}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xl={9}>
          <Card>
            <CardBody>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control size="lg" type="email" value={user?.email || ""} readOnly disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control size="lg" type="text" defaultValue={user?.displayName || ""} onChange={(e) => handleUpdate("displayName", e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control size="lg" type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    size="lg"
                    type="number"
                    defaultValue={user?.phone || ""}
                    onChange={(e) => {
                      const phone = parseInt(e.target.value, 10);
                      if (!isNaN(phone)) {
                        handleUpdate("phone", phone);
                      }
                    }}
                  />
                </Form.Group>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3}>
          <Card>
            <CardBody>
              <CardTitle>User Profile</CardTitle>
              <Image
                src={user?.photoURL || "https://mighty.tools/mockmind-api/content/abstract/4.jpg"}
                rounded
                fluid
              />
              <div className="d-flex flex-column mt-3 gap-3">
                <UserInfo icon={<IconMail size={30} />} label="Email" value={user?.email} />
                <UserInfo icon={<IconLabel size={30} />} label="Display Name" value={user?.displayName} />
                <UserInfo icon={<IconCoin size={30} />} label="Coin Balance" value={formatNumber(user?.coinBalance)} />
                <UserInfo icon={<IconStars size={30} />} label="Total Reviews" value={user?.totalReviews} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
