import { IconAlertCircle, IconBrandGoogleMaps } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { CardSubtitle, CardTitle, FormControl, FormGroup, FormText, Stack } from "react-bootstrap";
import { Form, useNavigate, useOutletContext } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { ScrapValidateButton } from "./ScrapValidateButton";
import { IUserInfo } from "../../types/userInfo";

/**
 * Component for validating Google Maps URL.
 */
export const ScrapValidateURL = ({
  containerId,
  container,
}: {
  containerId: string | undefined;
  container: IDockerContainer;
}) => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(container.url || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsDisabled(
      (container?.machine?.Action !== "die" && containerId !== undefined) || (!!containerId && user?.uid !== container?.uid)
    );
  }, [container, containerId, user?.uid]);

  useEffect(() => {
    setUrl(container.url || "");
  }, [container?.url]);

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

    setIsDisabled(true);

    try {
      setError(null);
      const { id } = await createDockerContainer({ url, uid: user?.uid, type: "info" });
      navigate(`/scrap/${id}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while validating the URL. Please try again.");
    } finally {
      setIsDisabled(false);
    }
  }

  return (
    <Stack direction="horizontal" gap={3} className="scrap-validate-url">
      <div className="text-primary">
        <IconBrandGoogleMaps size={48} />
      </div>
      <Stack direction="vertical">
        <CardTitle>Google Maps URL</CardTitle>
        <CardSubtitle>
          Validate a Google Maps URL to get information about the location.
        </CardSubtitle>
        <Form className="mt-3" onSubmit={handleSubmit} noValidate>
          <FormGroup className="mb-3" controlId="url">
            <FormControl
              type="url"
              value={url}
              placeholder="https://maps.app.goo.gl/..."
              onChange={(e) => setUrl(e.target.value)}
              pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
              required
              autoFocus
              disabled={isDisabled || user?.coinBalance <= 0}
            />
            <FormText className="invalid-feedback bg-danger-subtle">
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
            <ScrapValidateButton container={container} containerId={containerId} isDisabled={isDisabled || user?.coinBalance <= 0} />
          </Stack>
        </Form>
      </Stack>
    </Stack>
  );
};
