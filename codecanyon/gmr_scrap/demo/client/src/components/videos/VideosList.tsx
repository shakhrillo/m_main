import { IconPlayerPlay, IconReload } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import ReactPlayer from "react-player";
import { useOutletContext } from "react-router-dom";
import { IUserInfo } from "../../types/userInfo";

interface IVideosListProps {
  reviewId: string;
}

export const VideosList = ({ reviewId }: IVideosListProps) => {
  const user = useOutletContext<IUserInfo>();
  const [videos, setVideos] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const fetchVideos = (append = false) => {
    if (!user?.uid || isLastPage) return;

    // Unsubscribe from the previous subscription before starting a new one
    subscriptionRef.current?.unsubscribe();

    subscriptionRef.current = reviewsData(
      "videos",
      { reviewId, uid: !user.isAdmin ? user.uid : undefined },
      lastDoc
    )
      .pipe(filter((snapshot) => snapshot && snapshot.docs.length > 0))
      .subscribe((snapshot) => {
        console.log(snapshot);
        setIsLastPage(snapshot.empty || snapshot.docs.length < 10);
        setLastDoc(snapshot.docs.at(-1));

        setVideos((prev) =>
          append
            ? [...prev, ...snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))]
            : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
  };

  useEffect(() => {
    setVideos([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchVideos();

    return () => subscriptionRef.current?.unsubscribe();
  }, [reviewId]);

  return (
    <div className="videos">
      <Gallery>
        {videos.map(({ videoUrl, thumb }, index) => (
          <Item key={`video-${index}`} original={videoUrl} content={<ReactPlayer url={videoUrl} controls className="video" />}>
            {({ ref, open }) => (
              <div className="video-thumb-container" ref={ref} onClick={open}>
                <Image src={thumb} alt={`video-thumb-${index}`} className="video-thumb" />
                <IconPlayerPlay size={24} className="video-thumb-icon" />
              </div>
            )}
          </Item>
        ))}
      </Gallery>

      {!videos.length && <Alert className="w-100" variant="info">No videos found</Alert>}

      {!isLastPage && videos.length > 0 && (
        <Stack direction="horizontal" className="justify-content-center mt-3 w-100">
          <Button onClick={() => fetchVideos(true)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      )}
    </div>
  );
};
