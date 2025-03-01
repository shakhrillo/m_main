import { IconPhoto, IconReload } from "@tabler/icons-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import type { ICommentImage } from "../../types/comment";
import { useOutletContext } from "react-router-dom";
import type { IUserInfo } from "../../types/userInfo";
import type { Subscription } from "rxjs";
import { IDockerContainer } from "../../types/dockerContainer";

interface IImagesListProps {
  container: IDockerContainer;
  reviewId: string;
}

export const ImagesList = ({ container, reviewId }: IImagesListProps) => {
  const user = useOutletContext<IUserInfo>();
  const [images, setImages] = useState<ICommentImage[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const subscriptionRef = useRef<Subscription | null>(null);

  const fetchImages = useCallback(
    (append = false, lastDocRef = lastDoc) => {
      if (!user?.uid || isLastPage) return;
  
      subscriptionRef.current?.unsubscribe();
  
      const subscription = reviewsData(
        "images",
        { reviewId, uid: user.isAdmin ? undefined : user.uid },
        lastDocRef,
      )
        .pipe(filter((snapshot) => snapshot && snapshot.docs.length > 0))
        .subscribe((snapshot) => {
          console.log(snapshot);
          const newImages = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as ICommentImage
          );
  
          setImages((prev) => (append ? [...prev, ...newImages] : newImages));
          setLastDoc(snapshot.docs.at(-1));
          setIsLastPage(snapshot.empty || snapshot.docs.length < 10);
        });
  
      subscriptionRef.current = subscription;
    },
    [user, reviewId, isLastPage]
  );  

  useEffect(() => {
    setImages([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchImages(false, null);
  
    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [reviewId]);  

  return (
    <div className="images">
      <Gallery>
        {images.map(({ id, original, thumb }, index) => (
          <Item
            key={`image-${index}`}
            original={original}
            content={
              <Image src={original} alt={`image-${id}`} className="image" />
            }
          >
            {({ ref, open }) => (
              <div className="image-thumb-container" ref={ref} onClick={open}>
                <Image
                  src={thumb}
                  alt={`image-thumb-${id}`}
                  className="image-thumb"
                />
                <IconPhoto size={24} className="image-thumb-icon" />
              </div>
            )}
          </Item>
        ))}
      </Gallery>

      {images.length === 0 && (
        <Alert className="w-100" variant="info">
          No images found
        </Alert>
      )}

      {!isLastPage && images.length > 0 && images.length !== container?.totalImages && (
        <Stack
          direction="horizontal"
          className="justify-content-center mt-3 w-100"
        >
          <Button onClick={() => fetchImages(true, lastDoc)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
