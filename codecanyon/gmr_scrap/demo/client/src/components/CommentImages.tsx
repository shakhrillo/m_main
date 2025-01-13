import { Col, Image, Stack } from "react-bootstrap";
import { IComment } from "../services/scrapService";
import { Gallery, Item } from "react-photoswipe-gallery";

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
          zoom: false,
          showHideAnimationType: "none",
          hideAnimationDuration: 0,
          showAnimationDuration: 0,
          zoomAnimationDuration: 0,
          bgOpacity: 0.9,
        }}
      >
        {comment?.imageUrls.map((image, index) => (
          <Item original={image.thumb} key={index}>
            {({ ref, open }) => (
              <Image
                src={image.thumb}
                key={index}
                width={50}
                className={"ms-n3" + (index >= 3 ? " d-none" : "")}
                rounded
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
          <span className="ms-2">+{(comment?.imageUrls?.length ?? 0) - 3}</span>
        </div>
      )}
    </Stack>
  );
};
