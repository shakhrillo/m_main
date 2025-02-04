import { Image } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactPlayer from "react-player";
import Scrollbar from "react-scrollbars-custom";
import { IComment } from "../../services/scrapService";
import { IconPlayerPlay, IconVideo } from "@tabler/icons-react";

interface ICommentVideosProps {
  comment?: IComment;
}

export const CommentVideos = ({ comment }: ICommentVideosProps) => {
  return (
    !!comment?.videoUrls?.length && (
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
        <div className="comment-media">
          <Scrollbar>
            {comment?.videoUrls.map((video, index) => (
              <Item
                key={`comment-${index}`}
                original={video.videoUrl}
                thumbnail={video.thumb}
                content={
                  <ReactPlayer
                    url={video.videoUrl}
                    controls
                    className="comment-video"
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
                      src={video.thumb}
                      alt={`comment-thumb-${index}`}
                      className="comment-thumb"
                    />
                    <IconPlayerPlay size={24} className="comment-thumb-icon" />
                  </div>
                )}
              </Item>
            ))}
          </Scrollbar>
        </div>
      </Gallery>
    )
  );
};
