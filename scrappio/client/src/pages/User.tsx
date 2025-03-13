import type { JSX } from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { filter, map } from "rxjs";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { formatNumber } from "../utils/formatNumber";
import type { IUserInfo } from "../types/userInfo";
import { IconCoin, IconLabel, IconMail, IconStars } from "@tabler/icons-react";
import { Buffer } from "buffer";
import { uploadFile } from "../services/uploadService";
import { userData, updateUser } from "../services/userService";

/**
 * User info component.
 */
const UserInfo = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value?: any;
}) => (
  <Stack direction="horizontal" className="align-items-start" gap={3}>
    <span>{icon}</span>
    <div>
      <strong>{label}</strong>
      <div className="text-break">{value || "N/A"}</div>
    </div>
  </Stack>
);

/**
 * User page component.
 */
export const User = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const user = useOutletContext<IUserInfo>();
  const [selectedUser, setSelectedUser] = useState<IUserInfo | null>(null);
  const [buffer, setBuffer] = useState<Buffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = userData(userId)
      .pipe(
        filter(Boolean),
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IUserInfo),
          })),
        ),
      )
      .subscribe((data) => {
        setSelectedUser(data[0]);
        setLoading(false);
      });
    return () => subscriptionRef.current?.unsubscribe();
  }, [userId]);

  useEffect(() => {
    setIsDisabled(
      !user || !userId || selectedUser?.isDeleted || user?.uid !== userId,
    );
  }, [user, selectedUser, userId]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () =>
        setBuffer(Buffer.from(new Uint8Array(reader.result as ArrayBuffer)));
      reader.onerror = (err) => console.error("Error reading the file:", err);
      reader.readAsArrayBuffer(file);
    },
    [],
  );

  useEffect(() => {
    if (!buffer || !userId) return;
    (async () => {
      try {
        const photoURL = await uploadFile(buffer, "users");
        if (photoURL) await updateUser(userId, { photoURL });
      } catch (err) {
        let message = "An error occurred while uploading the photo.";
        if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      }
    })();
  }, [buffer, userId]);

  const handleUpdate = useCallback(
    (field: string, value: any) => {
      if (userId) {
        try {
          updateUser(userId, { [field]: value });
        } catch (err) {
          let message = "An error occurred while updating the user.";
          if (err instanceof Error) {
            message = err.message;
          }
          setError(message);
        }
      }
    },
    [userId],
  );

  const deleteUser = useCallback(async () => {
    if (!selectedUser?.uid) return;
    try {
      await updateUser(selectedUser.uid, { isDeleted: true });
      navigate(user?.isAdmin ? "/users" : "/auth/logout");
    } catch (err) {
      let message = "An error occurred while deleting the user.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  }, [navigate, user, selectedUser]);

  if (loading) return <p>Loading user data...</p>;

  return (
    <Container>
      <Breadcrumb>
        {user?.isAdmin && (
          <Breadcrumb.Item onClick={() => navigate("/users")}>
            Users
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>
          {selectedUser?.displayName || "User"}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col sm={12}>
          <Alert variant="warning">
            For demo purposes, you can not delete the user. Please purchase the
            full version.
          </Alert>
        </Col>
        <Col xl={9}>
          <Form className="user-form">
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser?.email || ""}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedUser?.displayName || ""}
                onBlur={(e) => handleUpdate("displayName", e.target.value)}
                disabled={isDisabled}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isDisabled}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedUser?.phone || ""}
                onBlur={(e) =>
                  handleUpdate("phone", parseInt(e.target.value, 10))
                }
                disabled={isDisabled}
              />
            </Form.Group>
          </Form>
        </Col>

        <Col xl={3}>
          <div className="user-info">
            {selectedUser?.photoURL && (
              <Image src={selectedUser.photoURL} rounded fluid />
            )}
            <div className="d-flex flex-column mt-3 gap-3">
              {selectedUser?.isDeleted && (
                <Alert variant="danger">This user has been deleted.</Alert>
              )}
              <UserInfo
                icon={<IconMail />}
                label="Email"
                value={selectedUser?.email}
              />
              <UserInfo
                icon={<IconLabel />}
                label="Display Name"
                value={selectedUser?.displayName}
              />
              <UserInfo
                icon={<IconCoin />}
                label="Coin Balance"
                value={formatNumber(selectedUser?.coinBalance)}
              />
              <UserInfo
                icon={<IconStars />}
                label="Total Reviews"
                value={selectedUser?.totalReviews}
              />
            </div>
            {!selectedUser?.isDeleted && (
              <Button variant="danger" onClick={deleteUser}>
                Delete User
              </Button>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
