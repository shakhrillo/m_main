import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ReviewCard } from "../../components/review-card";
import ReviewInfo from "../../components/ReviewInfo";
import { useFirebase } from "../../contexts/FirebaseProvider";

function SingleReview() {
  const { place } = useParams();
  const { firestore, user } = useFirebase();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!firestore || !place || !user) return;

    const reviewsRef = collection(firestore, "users", user.uid, "reviews", place, "reviews");
    const unsubscribe = onSnapshot(reviewsRef, snapshot => {
      const newReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(newReviews);
      console.log("Fetched reviews:", newReviews);
    });

    return () => unsubscribe();
  }, [firestore, user, place]);

  return (
    <div className="single-review">
      <div className="single-review__wrapper">
        <div className="single-review__header">
          <ReviewInfo />
        </div>
        {reviews.map((review, index) => (
          <ReviewCard review={review} key={review.id || index} />
        ))}
      </div>
    </div>
  );
}

export default SingleReview;
