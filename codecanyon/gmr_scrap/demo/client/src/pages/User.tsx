import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  FormControl,
  FormLabel,
  FormText,
  Row,
} from "react-bootstrap";
import { Form, useParams } from "react-router-dom";
import { userData } from "../services/userService";

export const User = () => {
  const { userId } = useParams() as { userId: string };
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
    photoURL: string;
    phone: number;
  }>({
    displayName: "",
    email: "",
    photoURL: "",
    phone: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const user$ = userData(userId).subscribe((user) => {
      console.log("user", user);
      setUser(user as any);
    });

    return () => {
      user$.unsubscribe();
    };
  }, [userId]);

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Form>
                <Row className="row-cols-1 row-cols-md-2 g-3">
                  <Col>
                    <FormLabel htmlFor="displayName">Display Name</FormLabel>
                    <FormControl
                      type="text"
                      id="displayName"
                      aria-describedby="displayNameHelpBlock"
                      value={user.displayName}
                      onChange={(e) =>
                        setUser({ ...user, displayName: e.target.value })
                      }
                    />
                    <FormText id="displayNameHelpBlock" muted>
                      The display name of the user.
                    </FormText>
                  </Col>
                  <Col>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl
                      type="email"
                      id="email"
                      aria-describedby="emailHelpBlock"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                    <FormText id="emailHelpBlock" muted>
                      The email address of the user.
                    </FormText>
                  </Col>
                  <Col>
                    <FormLabel htmlFor="phone">Phone</FormLabel>
                    <FormControl
                      type="tel"
                      id="phone"
                      aria-describedby="phoneHelpBlock"
                      value={user.phone}
                      onChange={(e) =>
                        setUser({ ...user, phone: parseInt(e.target.value) })
                      }
                    />
                    <FormText id="phoneHelpBlock" muted>
                      The phone number of the user.
                    </FormText>
                  </Col>
                  <Col>
                    <FormLabel htmlFor="photoURL">Photo URL</FormLabel>
                    <FormControl
                      type="url"
                      id="photoURL"
                      aria-describedby="photoURLHelpBlock"
                      value={user.photoURL}
                      onChange={(e) =>
                        setUser({ ...user, photoURL: e.target.value })
                      }
                    />
                    <FormText id="photoURLHelpBlock" muted>
                      The URL of the user's profile picture.
                    </FormText>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
