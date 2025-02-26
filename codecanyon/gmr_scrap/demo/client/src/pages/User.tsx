import { IconCoin, IconLabel, IconMail, IconStars } from "@tabler/icons-react";
import { Buffer } from "buffer";
import { JSX, useCallback, useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Form, Image, Row, Stack } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { uploadFile, updateUser, userData } from "../services";
import { formatNumber } from "../utils/formatNumber";
import { IUserInfo } from "../types/userInfo";
import { filter, map, take } from "rxjs";

interface ChangeUserPhotoEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget;
}

/**
 * User info component
 * @param icon JSX.Element
 * @param label string
 * @param value any
 * @returns JSX.Element
 */
const UserInfo = ({ icon, label, value }: { icon: JSX.Element; label: string; value?: any }) => (
  <Stack direction="horizontal" className="align-items-start">
    <span>{icon}</span>
    <div className="ms-3">
      <strong>{label}</strong>
      <p className="text-break">{value || "N/A"}</p>
    </div>
  </Stack>
);

/**
 * User page component
 * @returns JSX.Element
 */
export const User = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const user = useOutletContext<IUserInfo>();
  const [selectedUser, setSelectedUser] = useState<IUserInfo | null>(null);
  const [buffer, setBuffer] = useState<Buffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const subscription = userData(userId).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IUserInfo }))),
      take(1)
    ).subscribe((data) => {
      setSelectedUser(data[0]);
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
        if (!photoURL) return;
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
        {
          user?.isAdmin && <Breadcrumb.Item onClick={() => navigate("/users")}>Users</Breadcrumb.Item>
        }
        <Breadcrumb.Item active>{selectedUser?.displayName || "User"}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xl={9}>
          <Form className="user-form">
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={selectedUser?.email || ""} readOnly disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedUser?.displayName || ""} onChange={(e) => handleUpdate("displayName", e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedUser?.phone || ""}
                onChange={(e) => {
                  const phone = parseInt(e.target.value, 10);
                  if (!isNaN(phone)) {
                    handleUpdate("phone", phone);
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Col>

        <Col xl={3}>
          <div className="user-info">
            {
              selectedUser?.photoURL && (
                <Image src={selectedUser?.photoURL} rounded fluid />
              )
            }
            <div className="d-flex flex-column mt-3">
              <UserInfo icon={<IconMail />} label="Email" value={selectedUser?.email} />
              <UserInfo icon={<IconLabel />} label="Display Name" value={selectedUser?.displayName} />
              <UserInfo icon={<IconCoin />} label="Coin Balance" value={formatNumber(selectedUser?.coinBalance)} />
              <UserInfo icon={<IconStars />} label="Total Reviews" value={selectedUser?.totalReviews} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
