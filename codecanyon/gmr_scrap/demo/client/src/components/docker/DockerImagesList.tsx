import { useState, useEffect } from "react";
import { filter, map, take } from "rxjs";
import { dockerImages } from "../../services/dockerService";
import { IconReload } from "@tabler/icons-react";
import { Stack, Button } from "react-bootstrap";
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
    <NavLink className="h6" to={`/images/${image.id}`}>
      {image.id}
    </NavLink>
    <Stack direction="horizontal" gap={2} className="text-muted">
      <div>{image?.Os}</div>
      <div>{formatSize(image?.Size ?? 0)}</div>
      <div>{image?.Architecture}</div>
      <div>{image?.Type}</div>
      <div>{formatStringDate(image?.Created ?? "")}</div>
    </Stack>
  </div>
);

export const DockerImagesList = () => {
  const [images, setImages] = useState<IDockerImage[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchImages = (append = false, lastDocument: QueryDocumentSnapshot | null = null) => {
    return dockerImages(lastDocument)
      .pipe(
        filter(snapshot => !!snapshot),
        map(snapshot => {
          if (snapshot.empty) {
            setIsLastPage(true);
            return [];
          }
          if (snapshot.docs.length < 10) setIsLastPage(true);

          const lastDoc = snapshot.docs.at(-1);
          if (lastDoc) {
            setLastDoc(lastDoc);
          }
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }),
        take(1)
      )
      .subscribe(data => {
        setImages(prev => (append ? [...prev, ...data] : data));
      });
  };

  useEffect(() => {
    const subscription = fetchImages();
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {images.map(image => (
        <DockerImageItem key={image.id} image={image} />
      ))}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3">
          <Button onClick={() => fetchImages(true, lastDoc)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </>
  );
};
