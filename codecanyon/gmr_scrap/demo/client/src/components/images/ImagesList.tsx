import { IconPhoto } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { useOutletContext } from "react-router-dom";
import { debounceTime, Subject } from "rxjs";
import { reviewImages } from "../../services/reviewService";

interface IImagesListProps {
  reviewId: string;
}

export const ImagesList = ({ reviewId }: IImagesListProps) => {
  const { uid } = useOutletContext<User>();
  const [images, setImages] = useState([] as any[]);
  const [filterOptions, setFilterOptions] = useState({
    onlyImages: false,
    onlyVideos: false,
    onlyQA: false,
    onlyResponse: false,
  });
  const [search, setSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());

  useEffect(() => {
    const subscription = searchSubject
      .pipe(debounceTime(300))
      .subscribe((value) => {
        setSearch(value);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = reviewImages(
      reviewId,
      uid,
      filterOptions,
      search,
    ).subscribe((data) => {
      setImages(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, uid]);

  return (
    <div className="images">
      <Gallery>
        {images.map((image, index) => (
          <Item
            original={image.original}
            key={`image-${index}`}
            content={
              <Image
                src={image.original}
                alt={`image-${index}`}
                className="image"
              />
            }
          >
            {({ ref, open }) => (
              <div className="image-thumb-container" ref={ref} onClick={open}>
                <Image
                  src={image.thumb}
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
    </div>
  );
};
