import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { Gallery, Item } from "react-photoswipe-gallery";
import { scrapImages } from "../../services/scrapService";
import { User } from "firebase/auth";

function ReviewImages() {
  const { place } = useParams() as { place: string };
  const { uid } = useOutletContext<User>();
  const [reviewImgs, setReviewImgs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = scrapImages(place, uid).subscribe((data) => {
      console.log("images", data);
      setReviewImgs(data);
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
        }}
      >
        {reviewImgs.map((img, index) => (
          <Item original={img.thumb || img.videoUrl} key={index}>
            {({ ref, open }) => (
              <div className="col">
                <img
                  ref={ref}
                  onClick={open}
                  src={img.thumb || img.videoUrl}
                  alt={`Review ${index}`}
                  className="img-fluid img-thumbnail rounded"
                />
              </div>
            )}
          </Item>
        ))}
      </Gallery>
    </div>
  );
}

export default ReviewImages;
