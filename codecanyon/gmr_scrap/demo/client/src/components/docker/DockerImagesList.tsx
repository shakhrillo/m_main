import { useState, useEffect, useRef } from "react";
import { filter, map, take } from "rxjs";
import { dockerImages } from "../../services/dockerService";
import { IconReload } from "@tabler/icons-react";
import { Stack, Button, Row, Col } from "react-bootstrap";
import { formatSize, formatStringDate } from "../../utils";
import { NavLink } from "react-router-dom";
import { QueryDocumentSnapshot } from "firebase/firestore";

interface IDockerImage {
  id: string;
  Os?: string;
  Size?: number;
  Architecture?: string;
  Type?: string;
  Created?: string;
}

const DockerImageItem = ({ image }: { image: IDockerImage }) => (
  <div className="docker-image-data">
    <NavLink to={`/images/${image.id}`}>
      {image.id}
    </NavLink>
    <Stack direction="horizontal" gap={2} className="text-muted">
      <div>{image?.Os}</div>
      <div>{formatSize(image?.Size ?? 0)}</div>
      <div>{image?.Architecture}</div>
      <div>{image?.Type}</div>
    </Stack>
    <div className="docker-image-time">
      {formatStringDate(image?.Created ?? "")}
    </div>
  </div>
);

export const DockerImagesList = () => {
  const [images, setImages] = useState<IDockerImage[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const fetchImages = (append = false, lastDocument: QueryDocumentSnapshot | null = null) => {
    // Unsubscribe previous subscription before making a new request
    subscriptionRef.current?.unsubscribe();

    subscriptionRef.current = dockerImages(lastDocument)
      .pipe(
        filter(snapshot => !!snapshot),
        map(snapshot => {
          if (snapshot.empty) {
            setIsLastPage(true);
            return [];
          }
          if (snapshot.docs.length < 10) setIsLastPage(true);

          const newLastDoc = snapshot.docs.at(-1);
          if (newLastDoc) {
            setLastDoc(newLastDoc);
          }

          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        })
      )
      .subscribe(data => {
        setImages(prev => (append ? [...prev, ...data] : data));
      });
  };

  useEffect(() => {
    fetchImages();

    return () => subscriptionRef.current?.unsubscribe();
  }, []);

  return (
    <Row className="g-3 row-cols-1">
      {images.map(image => (
        <Col key={image.id}>
          <DockerImageItem image={image} />
        </Col>
      ))}

      {!isLastPage && images.length > 0 && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button onClick={() => fetchImages(true, lastDoc)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </Row>
  );
};
