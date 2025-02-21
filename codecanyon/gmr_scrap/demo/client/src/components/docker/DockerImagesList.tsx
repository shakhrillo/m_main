import { useState, useEffect } from "react";
import { filter, map, take } from "rxjs";
import { dockerImages } from "../../services/dockerService";
import { IconReload } from "@tabler/icons-react";
import { Stack, Button } from "react-bootstrap";
import { formatSize, formatStringDate } from "../../utils";
import { NavLink } from "react-router-dom";

export const DockerImagesList = () => {
  const [images, setImages] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  
  const fetchImages = (append = false, lastDocument = null) => {
    return dockerImages(lastDocument).pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        if (snapshot.empty) {
          setIsLastPage(true);
          return [];
        }
        setLastDoc(snapshot.docs.at(-1));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as any }));
      }),
      take(1),
    ).subscribe((data) => {
      setImages(prev => (append ? [...prev, ...data] : data));
    })
  };

  useEffect(() => {
    const subscription = fetchImages();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMore = () => {
    if (!isLastPage) fetchImages(true, lastDoc);
  };

  return (
    <>
      {
        images.map((image) => (
          <div key={image.id} className="docker-image-data">
            <NavLink className={"h6"} to={`/images/${image.id}`}>
              {image.id}
            </NavLink>
            <Stack direction="horizontal" gap={2} className="text-muted">
              <div>{image?.Os}</div>
              <div>{formatSize(image?.Size)}</div>
              <div>{image?.Architecture}</div>
              <div>{image?.Type}</div>
              <div>{formatStringDate(image?.Created)}</div>
            </Stack>
          </div>
        ))
      }
      {
        !isLastPage && (
          <Stack direction="horizontal" className="justify-content-center mt-3">
            <Button onClick={loadMore} variant="outline-primary">
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )
      }
    </>
  )
};