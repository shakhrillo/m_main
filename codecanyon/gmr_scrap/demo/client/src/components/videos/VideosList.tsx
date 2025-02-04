import { IconPhoto, IconPlayerPlay } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { useOutletContext } from "react-router-dom";
import { debounceTime, Subject } from "rxjs";
import { reviewVideos } from "../../services/reviewService";
import ReactPlayer from "react-player";

interface IVideosListProps {
  reviewId: string;
}

export const VideosList = ({ reviewId }: IVideosListProps) => {
  const { uid } = useOutletContext<User>();
  const [videos, setVideos] = useState([] as any[]);
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
    const subscription = reviewVideos(
      reviewId,
      uid,
      filterOptions,
      search,
    ).subscribe((data) => {
      setVideos(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId, filterOptions, search, uid]);

  return (
    <div className="videos">
      <Gallery>
        {videos.map((video, index) => (
          <Item
            key={`video-${index}`}
            original={video.videoUrl}
            thumbnail={video.thumb}
            content={
              <ReactPlayer url={video.videoUrl} controls className="video" />
            }
          >
            {({ ref, open }) => (
              <div className="video-thumb-container" ref={ref} onClick={open}>
                <Image
                  src={video.thumb}
                  alt={`video-thumb-${index}`}
                  className="video-thumb"
                />
                <IconPlayerPlay size={24} className="comment-thumb-icon" />
              </div>
            )}
          </Item>
        ))}
      </Gallery>
      {!videos.length && (
        <Alert className="w-100" variant="info">
          No videos found
        </Alert>
      )}
    </div>
  );
};
