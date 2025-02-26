import { IconPhoto } from "@tabler/icons-react";
import { Image } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { IComment } from "../../types/comment";

interface ICommentImages {
  comment?: IComment;
}

export const CommentImages = ({ comment }: ICommentImages) => {
  return (
    !!comment?.imageUrls?.length && (
      <Gallery>
        <div className="comment-media">
          {comment?.imageUrls.map((image, index) => (
            <Item
              original={image.original}
              key={`comment-${index}`}
              content={
                <Image
                  src={image.original}
                  alt={`comment-${index}`}
                  className="comment-image"
                />
              }
            >
              {({ ref, open }) => (
                <div
                  className="comment-thumb-container"
                  ref={ref}
                  onClick={open}
                >
                  <Image
                    src={image.thumb}
                    alt={`comment-thumb-${index}`}
                    className="comment-thumb"
                  />
                  <IconPhoto size={24} className="comment-thumb-icon" />
                </div>
              )}
            </Item>
          ))}
        </div>
      </Gallery>
    )
  );
};
