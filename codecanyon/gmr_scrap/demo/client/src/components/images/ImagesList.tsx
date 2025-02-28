import { IconPhoto, IconReload } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import type { ICommentImage } from "../../types/comment";
import { useOutletContext } from "react-router-dom";
import type { IUserInfo } from "../../types/userInfo";

interface IImagesListProps {
  reviewId: string;
}

export const ImagesList = ({ reviewId }: IImagesListProps) => {
  const user = useOutletContext<IUserInfo>();
  const [images, setImages] = useState<ICommentImage[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const fetchImages = (append = false) => {
    if (!user?.uid || isLastPage) return;

    subscriptionRef.current?.unsubscribe(); // Ensure previous subscription is cleared

    subscriptionRef.current = reviewsData(
      "images",
      { reviewId, uid: !user.isAdmin ? user.uid : undefined },
      lastDoc,
    )
      .pipe(filter((snapshot) => snapshot && snapshot.docs.length > 0))
      .subscribe((snapshot) => {
        setIsLastPage(snapshot.empty || snapshot.docs.length < 10);
        setLastDoc(snapshot.docs.at(-1));

        setImages((prev) =>
          append
            ? [
                ...prev,
                ...snapshot.docs.map(
                  (doc) => ({ id: doc.id, ...doc.data() }) as ICommentImage,
                ),
              ]
            : snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() }) as ICommentImage,
              ),
        );
      });
  };

  useEffect(() => {
    setImages([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchImages();

    return () => subscriptionRef.current?.unsubscribe();
  }, [reviewId]);

  return (
    <div className="images">
      <Gallery>
        {images.map(({ original, thumb }, index) => (
          <Item
            key={`image-${index}`}
            original={original}
            content={
              <Image src={original} alt={`image-${index}`} className="image" />
            }
          >
            {({ ref, open }) => (
              <div className="image-thumb-container" ref={ref} onClick={open}>
                <Image
                  src={thumb}
                  alt={`image-thumb-${index}`}
                  className="image-thumb"
                />
                <IconPhoto size={24} className="image-thumb-icon" />
              </div>
            )}
          </Item>
        ))}
      </Gallery>

      {!images.length && (
        <Alert className="w-100" variant="info">
          No images found
        </Alert>
      )}

      {!isLastPage && images.length > 0 && (
        <Stack
          direction="horizontal"
          className="justify-content-center mt-3 w-100"
        >
          <Button onClick={() => fetchImages(true)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
