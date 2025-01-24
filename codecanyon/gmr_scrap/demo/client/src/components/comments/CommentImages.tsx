import { Image } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { IComment } from "../../services/scrapService";

interface ICommentImagesProps {
  comment?: IComment;
}

export const CommentImages = ({ comment }: ICommentImagesProps) => {
  return (
    <div className="comment-media">
      <Gallery>
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
              <Image
                src={image.thumb}
                alt={`comment-thumb-${index}`}
                className="comment-thumb"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        ))}
      </Gallery>
    </div>
  );
};
