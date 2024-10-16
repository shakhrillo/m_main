import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

function ReviewsView() {
  let { place } = useParams();
  const [reviews, setReviews] = useState([] as any[]);  
  const db = useAppSelector((state) => state.firebase.db);

  useEffect(() => {
    if (!db || !place) return;
    setReviews([]);    
    const collectionReviews = collection(db, "reviews", place, "reviews");

    onSnapshot(collectionReviews, (querySnapshot) => {
      setReviews([]);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const data = doc.data();
        setReviews((prev) => [...prev, {
          ...data,
          id: doc.id,
        }]);
      });
    });
  }, [db, place]);

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Images</th>
            <th scope="col">Content</th>
          </tr>
        </thead>
        <tbody>
          {
            reviews && reviews.map((review: any) => {
              return (
                <tr key={review.id}>
                  <th scope="row">{review.id}</th>
                  <td>
                    {
                      review.images && review.images.map((image: any, index: number) => (
                        <img
                          className="img-thumbnail"
                          width="100"
                          key={index}
                          src={image}
                          alt="review"
                        />
                      ))
                    }
                  </td>
                  <td>
                    {review.reviewText}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default ReviewsView;