import { IconPlayerPlay, IconReload } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Stack } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import { filter, take } from "rxjs";
import { reviewsData } from "../../services/reviewService";
import ReactPlayer from "react-player";

interface IVideosListProps {
  reviewId: string;
}

export const VideosList = ({ reviewId }: IVideosListProps) => {
  const auth = getAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchVideos = (append = false) => {
    if (!auth.currentUser?.uid || isLastPage) return;

    reviewsData("videos", { reviewId, uid: auth.currentUser.uid }, lastDoc)
      .pipe(
        filter((snapshot) => snapshot !== null && (snapshot.size !== 0 || !!lastDoc)),
        take(1)
      )
      .subscribe(snapshot => {
        setIsLastPage(snapshot.empty || snapshot.docs.length < 10);

        const newVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideos(prev => (append ? [...prev, ...newVideos] : newVideos));
        setLastDoc(snapshot.docs.at(-1));
      });
  };

  useEffect(() => {
    setVideos([]);
    setLastDoc(null);
    setIsLastPage(false);
    fetchVideos();
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

      {!isLastPage && videos.length ? (
        <Stack direction="horizontal" className="justify-content-center mt-3 w-100">
          <Button onClick={() => fetchVideos(true)} variant="outline-primary">
            <IconReload className="me-2" /> Load more
          </Button>
        </Stack>
      ) : ""}
    </div>
  );
};
