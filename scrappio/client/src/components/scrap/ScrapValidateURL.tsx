import { IconAlertCircle, IconBrandGoogleMaps } from "@tabler/icons-react";
import { use, useEffect, useState } from "react";
import {
  CardSubtitle,
  CardTitle,
  FormControl,
  FormGroup,
  FormText,
  Stack,
} from "react-bootstrap";
import { Form, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";
import type { IDockerContainer } from "../../types/dockerContainer";
import { ScrapValidateButton } from "./ScrapValidateButton";
import type { IUserInfo } from "../../types/userInfo";

/**
 * Scrap validate URL component
 * @param containerId string
 * @param container IDockerContainer
 * @returns JSX.Element
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
  const [searchParams] = useSearchParams();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(container.url || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerId) {
      const shareLink = searchParams.get("shareLink");
      setUrl(shareLink || "");
    }
  }, [containerId, searchParams]);

  useEffect(() => {
    setIsDisabled(
      (container?.machine?.Action !== "destroy" &&
        container?.machine?.Action !== "die" &&
        containerId !== undefined) ||
        (!!containerId && user?.uid !== container?.uid),
    );
  }, [container, containerId, user?.uid]);

  useEffect(() => {
    if (!container?.url) return;
    setUrl(container.url || "");
  }, [container?.url]);

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
        url,
        uid: user?.uid,
        type: "info",
      });
      navigate(`/scrap/${id}`);
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
              disabled={
                (isDisabled || user?.coinBalance <= 0) &&
                container?.status !== "completed"
              }
            />
            <FormText className="invalid-feedback bg-danger-subtle">
              <IconAlertCircle className="me-2" size={20} />
              Please provide a valid Google Maps URL. Example:
              https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
            </FormText>
          </FormGroup>
          {error && (
            <div className="text-danger">
              <IconAlertCircle className="me-2" size={20} />
              {error}
            </div>
          )}
          <Stack direction="horizontal">
            <ScrapValidateButton
              container={container}
              containerId={containerId}
              isDisabled={
                (isDisabled || user?.coinBalance <= 0) &&
                container?.status !== "completed"
              }
            />
          </Stack>
        </Form>
      </Stack>
    </Stack>
  );
};
