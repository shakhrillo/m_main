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
import { createDockerContainer, dockerContainerPlaces } from "../services/dockerService";
import { NavLink, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IUserInfo } from "../types/userInfo";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { Ratings } from "../components/Ratings";
import { ContainersList } from "../components/containers/ContainersList";

export const PlacesList = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();

  const { placeId } = useParams<{ placeId: string }>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('restaurants+near+Podolsk,+Russia');
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<any[]>([]);

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
    <Container>
      <ContainersList type="places" path="places" />
    </Container>
  );
}