import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { Gallery, Item } from "react-photoswipe-gallery";

function ReviewVideos() {
  const { place } = useParams();
  const { firestore, user } = useFirebase();
  const [reviewImgs, setReviewImgs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !place || !user) return;

    const reviewsImgRef = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "videos",
    );

    const q = query(reviewsImgRef);
    // const q = query(reviewsImgRef, orderBy("time", "asc"))

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviewImgs(reviewsData);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [firestore, user, place]);

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
        {reviewImgs.map((img, index) => (
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
