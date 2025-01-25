import { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { debounceTime, Subject } from "rxjs";
import { reviewImages } from "../../services/reviewService";
import { IconPhoto } from "@tabler/icons-react";
import { Gallery, Item } from "react-photoswipe-gallery";
import Scrollbar from "react-scrollbars-custom";
import { Image } from "react-bootstrap";

interface IImagesListProps {
  reviewId: string;
}

export const ImagesList = ({ reviewId }: IImagesListProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);
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
      console.log("images___", data);
      setImages(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, uid]);

  return (
    <Gallery>
      <div className="images">
        {/* <Scrollbar> */}
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
        {/* </Scrollbar> */}
      </div>
    </Gallery>
  );
};
