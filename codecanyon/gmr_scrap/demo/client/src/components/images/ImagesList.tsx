import { IconPhoto, IconReload } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter, take } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import { ICommentImage } from "../../types/comment";

interface IImagesListProps {
  reviewId: string;
}

export const ImagesList = ({ reviewId }: IImagesListProps) => {
  const auth = getAuth();
  const [images, setImages] = useState<ICommentImage[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchImages = (append = false) => {
    if (!auth.currentUser?.uid || isLastPage) return;

    reviewsData("images", { reviewId, uid: auth.currentUser.uid }, lastDoc)
      .pipe(filter(snapshot => snapshot !== null), take(1))
      .subscribe(snapshot => {
        if (snapshot.empty) return setIsLastPage(true);

        const newImages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ICommentImage));
        setImages(prev => (append ? [...prev, ...newImages] : newImages));
        setLastDoc(snapshot.docs.at(-1));
      });
  };

  useEffect(() => {
    setImages([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchImages();
  }, [reviewId]);

  return (
    <div className="images">
      <Gallery>
        {images.map(({ original, thumb }, index) => (
          <Item key={`image-${index}`} original={original} content={<Image src={original} alt={`image-${index}`} className="image" />}>
            {({ ref, open }) => (
              <div className="image-thumb-container" ref={ref} onClick={open}>
                <Image src={thumb} alt={`image-thumb-${index}`} className="image-thumb" />
                <IconPhoto size={24} className="image-thumb-icon" />
              </div>
            )}
          </Item>
        ))}
      </Gallery>

      {!images.length && <Alert className="w-100" variant="info">No images found</Alert>}

      {!isLastPage && (
        <Stack direction="horizontal" className="justify-content-center mt-3 w-100">
          <Button onClick={() => fetchImages(true)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
