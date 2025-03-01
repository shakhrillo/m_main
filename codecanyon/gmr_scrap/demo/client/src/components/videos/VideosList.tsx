import { IconPlayerPlay, IconReload } from "@tabler/icons-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import ReactPlayer from "react-player";
import { useOutletContext } from "react-router-dom";
import type { IUserInfo } from "../../types/userInfo";
import { IDockerContainer } from "../../types/dockerContainer";

interface IVideosListProps {
  container: IDockerContainer;
  reviewId: string;
}

export const VideosList = ({ container, reviewId }: IVideosListProps) => {
  const user = useOutletContext<IUserInfo>();
  const [videos, setVideos] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const fetchVideos = useCallback(
    (append = false, lastDocRef = lastDoc) => {
      if (!user?.uid || isLastPage) return;

      subscriptionRef.current?.unsubscribe();

      subscriptionRef.current = reviewsData(
        "videos",
        { reviewId, uid: !user.isAdmin ? user.uid : undefined },
        lastDocRef,
      )
        .pipe(filter((snapshot) => snapshot?.docs?.length > 0))
        .subscribe((snapshot) => {
          const newVideos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setVideos((prev) => (append ? [...prev, ...newVideos] : newVideos));
          setLastDoc(snapshot.docs.at(-1));
          setIsLastPage(snapshot.empty || newVideos.length < 10);
        });
    },
    [user, reviewId, isLastPage],
  );

  useEffect(() => {
    setVideos([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchVideos(false, null);

    return () => subscriptionRef.current?.unsubscribe();
  }, [reviewId]);

  return (
    <div className="videos">
      <Gallery>
        {videos.map(({ id, videoUrl, thumb }, index) => (
          <Item
            key={`video-${index}`}
            original={videoUrl}
            content={<ReactPlayer url={videoUrl} controls className="video" />}
          >
            {({ ref, open }) => (
              <div className="video-thumb-container" ref={ref} onClick={open}>
                <Image
                  src={thumb}
                  alt={`video-thumb-${index}`}
                  className="video-thumb"
                />
                <IconPlayerPlay size={24} className="video-thumb-icon" />
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

      {!isLastPage &&
        videos.length > 0 &&
        videos.length !== container?.totalVideos && (
          <Stack
            direction="horizontal"
            className="justify-content-center mt-3 w-100"
          >
            <Button
              onClick={() => fetchVideos(true, lastDoc)}
              variant="outline-primary"
            >
              <IconReload className="me-2" /> Load more
            </Button>
          </Stack>
        )}
    </div>
  );
};
