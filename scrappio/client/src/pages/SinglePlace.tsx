import { IconAlertCircle, IconMap } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { createDockerContainer, dockerContainerPlaces, dockerContainers } from "../services/dockerService";
import { NavLink, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IUserInfo } from "../types/userInfo";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { Ratings } from "../components/Ratings";
import { IDockerContainer } from "../types/dockerContainer";
import { filter, map } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";

export const SinglePlace = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();

  const { placeId } = useParams<{ placeId: string }>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!placeId || !user?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId: placeId,
      uid: user.isAdmin ? undefined : user.uid,
    })
      .pipe(
        filter(Boolean),
        map(
          (snapshot) =>
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }))[0],
        ),
      )
      .subscribe((data) => {
        console.log('Data:', data);
        return setContainer(data?.location ? data : ({} as IDockerContainer))
      }
      );

    return () => subscription.unsubscribe();
  }, [placeId, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    setIsDisabled(true);

    try {
      setError(null);
      const { id } = await createDockerContainer({
        url: `https://www.google.com/maps/search/${query}`,
        uid: user?.uid,
        type: "places",
      });
      navigate(`/places/${id}`);
    } catch (err: any) {
      let message = "An error occurred while validating the URL.";
      if (typeof err === "object" && err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsDisabled(false);
    }
  }

  useEffect(() => {
    if (!placeId) return;
    dockerContainerPlaces(placeId).subscribe((places) => {
      console.log("Places:", places);
      setPlaces(places);
    });
  }, [placeId]);

  return (
    <Container className="places">
      {placeId && (
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/places")}>
            Places
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{placeId}</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <Row>
        {/* <Col md={12}>
          <Stack direction="horizontal" gap={3} className="place-validate-url">
            <div className="text-primary">
              <IconMap size={48} />
            </div>
            <Stack direction="vertical">
              <CardTitle>Google Maps URL</CardTitle>
              <CardSubtitle>
                Validate a Google Maps URL to get information about the location.
              </CardSubtitle>
              <Form className="mt-3" onSubmit={handleSubmit} noValidate>
                <FormGroup className="mb-3" controlId="url">
                  <InputGroup className="mb-3">
                    <InputGroupText>
                      https://www.google.com/maps/search/
                    </InputGroupText>
                    <FormControl
                      type="text"
                      value={query}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '+');
                        setQuery(value);
                      }}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                {error && (
                  <div className="text-danger">
                    <IconAlertCircle className="me-2" size={20} />
                    {error}
                  </div>
                )}
                <Stack direction="horizontal">
                  <Button
                    type="submit"
                    variant="primary"
                    className="ms-auto"
                    disabled={isDisabled}
                  >
                    {isDisabled ? "Loading..." : "Submit"}
                  </Button>
                </Stack>
              </Form>
            </Stack>
          </Stack>
        </Col> */}
        <Col lg={8} xl={9}>
          <Stack direction="vertical" gap={3}>
            {places.map((place) => (
              <div className="place-data" key={place.id}>
                <NavLink to={`/scrap?shareLink=${place.shareLink}`}>
                  {place.title}
                </NavLink>
                <Ratings container={place} />
                <div className="text-muted">
                  {place?.olocLink?.text}
                </div>
              </div>
            ))}
          </Stack>
        </Col>
        <Col lg={4} xl={3}>
          <PlaceInfo container={container} />
        </Col>
      </Row>
    </Container>
  );
}