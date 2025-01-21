import {
  IconAlertCircle,
  IconBrandGoogleMaps,
  IconCircleCheck,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Stack,
} from "react-bootstrap";
import { Form, useNavigate, useOutletContext } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";

/**
 * Component for validating Google Maps URL.
 */
export const ScrapValidateURL = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission for URL validation.
   * @param e Form submission event.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    setLoading(true);

    try {
      setError(null);
      const { id } = await createDockerContainer({ url, uid, type: "info" });
      navigate(`/scrap/${id}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while validating the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card text="primary">
      <CardBody>
        <Stack direction="horizontal" gap={3} className="mb-3">
          <IconBrandGoogleMaps size={48} />
          <Stack direction="vertical">
            <h5 className="m-0 fs-3">Share a Google Maps URL to validate</h5>
            <span className="text-muted">
              Validate a Google Maps URL to get information about the location.
            </span>
          </Stack>
        </Stack>
        <Form onSubmit={handleSubmit} noValidate>
          <FormGroup className="mb-3" controlId="url">
            <FormLabel>Google Maps URL</FormLabel>
            <FormControl
              type="url"
              value={url}
              placeholder="https://maps.app.goo.gl/..."
              onChange={(e) => setUrl(e.target.value)}
              pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
              required
              size="lg"
              autoFocus
              disabled={loading}
            />
            <FormText className="invalid-feedback">
              <IconAlertCircle className="me-2" size={20} />
              Please provide a valid Google Maps URL. Example:
              https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
            </FormText>
          </FormGroup>
          {error && (
            <div className="alert alert-danger mt-3">
              <IconAlertCircle className="me-2" size={20} />
              {error}
            </div>
          )}
          <Stack direction="horizontal">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              className="ms-auto"
              disabled={loading || !url}
            >
              <Stack direction="horizontal" gap={2}>
                <IconCircleCheck />
                Validate URL
                <Badge bg="dark" text="light" className="top-0" pill>
                  3 points
                </Badge>
              </Stack>
            </Button>
          </Stack>
        </Form>
      </CardBody>
    </Card>
  );
};
