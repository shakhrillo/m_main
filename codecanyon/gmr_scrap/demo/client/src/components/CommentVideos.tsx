import { Col, Image, Stack } from "react-bootstrap";
import { IComment } from "../services/scrapService";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactPlayer from "react-player";

export const CommentVideos = ({
  comment,
  ...rest
}: {
  comment?: IComment;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Stack
      {...rest}
      direction="horizontal"
      style={{ marginLeft: "30px", width: "60px" }}
    >
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
        {comment?.videoUrls.map((video, index) => (
          <Item
            key={index}
            original={video.videoUrl} // Pass the video URL for direct playback
            thumbnail={video.thumb} // Optional: Thumbnail image for the gallery
            content={
              <ReactPlayer
                url={video.videoUrl}
                controls
                width="100%"
                height="100%"
              />
            } // Use ReactPlayer for rendering the video directly
          >
            {({ ref, open }) => (
              <div
                ref={ref}
                onClick={open}
                style={{ cursor: "pointer" }}
                className="ms-n3"
              >
                <Image
                  src={video.thumb}
                  key={index}
                  width={50}
                  className={index >= 3 ? " d-none" : ""}
                  rounded
                  thumbnail
                />
              </div>
            )}
          </Item>
        ))}
      </Gallery>

      {(comment?.videoUrls?.length ?? 0) > 3 && (
        <div>
          <span className="ms-2">+{(comment?.videoUrls?.length ?? 0) - 3}</span>
        </div>
      )}

      {comment?.videoUrls?.length === 0 && (
        <Col
          className="text-center border rounded"
          style={{ marginLeft: "-30px", minWidth: "60px" }}
        >
          <small>No videos</small>
        </Col>
      )}
    </Stack>
  );
};
