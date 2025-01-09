import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { useOutletContext, useParams } from "react-router-dom";
import { scrapVideos } from "../../services/scrapService";

function ReviewVideos() {
  const { place } = useParams() as { place: string };
  const { uid } = useOutletContext<User>();

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = scrapVideos(place, uid).subscribe((data) => {
      console.log("videos", data);
      setVideos(data);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [place]);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="row row-cols-6 g-2">
      <Gallery
        options={{
          zoom: false,
          showHideAnimationType: "none",
          hideAnimationDuration: 0,
          showAnimationDuration: 0,
          zoomAnimationDuration: 0,
          bgOpacity: 0.9,
          imageClickAction: () => {
            const pswpItem = document.querySelector(
              ".pswp__item[aria-hidden='false']",
            );
            const img = pswpItem?.querySelector("img");
            const alt = img?.getAttribute("alt") || "";
            window.open(alt, "_blank");
          },
        }}
      >
        {videos.map((img, index) => (
          <Item original={img.thumb} key={index} alt={img.videoUrl}>
            {({ ref, open }) => (
              <div className="col">
                <img
                  ref={ref}
                  onClick={open}
                  src={img.thumb}
                  className="img-fluid rounded"
                />
              </div>
            )}
          </Item>
        ))}
      </Gallery>
    </div>
  );
}

export default ReviewVideos;
