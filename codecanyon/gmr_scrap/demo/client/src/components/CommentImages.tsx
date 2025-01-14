import { Col, Image, Stack } from "react-bootstrap";
import { IComment } from "../services/scrapService";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

export const CommentImages = ({
  comment,
  ...rest
}: {
  comment?: IComment;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Stack {...rest} direction="horizontal">
      <Gallery
        options={{
          hideAnimationDuration: 0,
          zoomAnimationDuration: 0,
          showAnimationDuration: 0,
          showHideAnimationType: "fade",
          bgOpacity: 0.9,
        }}
      >
        {comment?.imageUrls.map((image, index) => (
          <Item
            original={image.thumb}
            key={`comment-${index}`}
            content={
              <div className="d-flex justify-content-center align-items-center h-100">
                <Image
                  src={image.thumb}
                  alt={`comment-${index}`}
                  style={{
                    height: "auto",
                    objectFit: "contain",
                    maxWidth: "90%",
                    maxHeight: "100vh",
                  }}
                />
              </div>
            }
          >
            {({ ref, open }) => (
              <Image
                src={image.thumb}
                alt={`comment-thumb-${index}`}
                width={40}
                style={{
                  height: 40,
                  objectFit: "cover",
                  cursor: "pointer",
                  marginLeft: "-30px",
                }}
                className={index >= 3 ? " d-none" : ""}
                thumbnail
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        ))}
      </Gallery>
      {(comment?.imageUrls?.length ?? 0) > 3 && (
        <div>
          <small className="ms-1">
            +{(comment?.imageUrls?.length ?? 0) - 3}
          </small>
        </div>
      )}
    </Stack>
  );
};
