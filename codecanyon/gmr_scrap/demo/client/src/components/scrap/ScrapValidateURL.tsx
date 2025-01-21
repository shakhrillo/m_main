import { IconAlertCircle } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Stack,
} from "react-bootstrap";
import { Form, useNavigate, useOutletContext } from "react-router-dom";
import { createDockerContainer } from "../../services/dockerService";

export const ScrapValidateURL = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [url, setUrl] = useState<string>("");

  /**
   * Validation URL
   * @param e Form event
   */
  async function handleUrlValidation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;
    target.classList.add("was-validated");
    if (!target.checkValidity()) return;

    try {
      const { id } = await createDockerContainer({ url, uid, type: "info" });
      navigate(`/scrap/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>Validate Place Info</CardTitle>
        <Form onSubmit={handleUrlValidation} noValidate id="validateForm">
          <FormGroup className="mb-3" controlId="url">
            <FormLabel>Google Maps URL</FormLabel>
            <FormControl
              type="text"
              className="form-control"
              value={url}
              placeholder="https://www.google.com/maps/place/..."
              onChange={(e) => setUrl(e.target.value)}
              pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
              itemRef="url"
              required
            />
            <FormText className="invalid-feedback">
              <IconAlertCircle className="me-2" size={20} />
              Given URL is not valid. Example URL:
              https://maps.app.goo.gl/9Jcrd1eE4eZnPXx38
            </FormText>
          </FormGroup>
          <Stack direction={"horizontal"}>
            {/* {placeInfo?.rating && (
              <Button variant="secondary" type="reset" onClick={clearResults}>
                Clear results
              </Button>
            )} */}
            <Button variant="primary" type="submit" className="ms-auto">
              Validate <Badge className="bg-secondary ms-2">3 points</Badge>
            </Button>
          </Stack>
        </Form>
      </CardBody>
    </Card>
  );
};
