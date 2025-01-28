import { IconCoin, IconLabel, IconMail, IconStars } from "@tabler/icons-react";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { uploadFile } from "../services/uploadService";
import { updateUser, userData } from "../services/userService";
import { UserInfo } from "../types/userInfo";
import formatNumber from "../utils/formatNumber";

interface ChangeUserPhotoEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget;
}

export const User = () => {
  const { userId } = useParams() as { userId: string };
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const [buffer, setBuffer] = useState<Buffer | null>(null);

  useEffect(() => {
    if (!userId) return;

    const subscription = userData(userId).subscribe((user) => {
      setUser(user as any);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const changeUserPhoto = (event: ChangeUserPhotoEvent): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buf = Buffer.from(new Uint8Array(arrayBuffer));
        setBuffer(buf);
      };

      reader.onerror = (err) => {
        console.error("Error reading the file:", err);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    const uploadPhoto = async () => {
      if (!buffer) return;

      try {
        const photoURL = await uploadFile(buffer as any, "users");
        updateUser(userId, { photoURL });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    uploadPhoto();
  }, [buffer, userId]);

  return (
    <Container fluid>
      <Row>
        <Col md={9}>
          <Card>
            <CardBody>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={user.email}
                    readOnly
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Display Name"
                    value={user.displayName}
                    onChange={async (e) => {
                      await updateUser(userId, { displayName: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Photo URL"
                    onChange={changeUserPhoto}
                    accept="image/*"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Phone"
                    value={user.phone}
                    onChange={async (e) => {
                      await updateUser(userId, {
                        phone: Number(e.target.value),
                      });
                    }}
                  />
                </Form.Group>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <CardTitle>User Profile</CardTitle>
              <Image src={user.photoURL} rounded fluid />
              <div className="d-flex flex-column mt-3 gap-3">
                <div className="d-flex align-items-center">
                  <span>
                    <IconMail size={30} />
                  </span>
                  <div className="ms-3">
                    <div className="text-break fw-bold">{user.email}</div>
                    <div className="text-break">Email</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span>
                    <IconLabel size={30} />
                  </span>
                  <div className="ms-3">
                    <div className="text-break fw-bold">{user.displayName}</div>
                    <div className="text-break">Display Name</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span>
                    <IconCoin size={30} />
                  </span>
                  <div className="ms-3">
                    <div className="text-break fw-bold">
                      {formatNumber(user.coinBalance)}
                    </div>
                    <div className="text-break">Coin Balance</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span>
                    <IconStars size={30} />
                  </span>
                  <div className="ms-3">
                    <div className="text-break fw-bold">
                      {user.totalReviews}
                    </div>
                    <div className="text-break">Total Reviews</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
