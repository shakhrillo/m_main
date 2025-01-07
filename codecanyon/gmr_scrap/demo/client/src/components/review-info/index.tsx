import { useEffect, useState } from "react"; // React hooks for lifecycle and state management
import { useParams } from "react-router-dom"; // React Router hook to get URL parameters
import { doc, onSnapshot } from "firebase/firestore"; // Firebase Firestore methods for real-time updates

import { useFirebase } from "../../contexts/FirebaseProvider"; // Custom context to access Firebase utilities
import { spentTime } from "../../utils/spentTime"; // Utility function to calculate spent time
import { statusRender } from "../../utils/statusRender"; // Utility function to render status icons

import StarRating from "../star-rating"; // Component to display star ratings

function ReviewInfo() {
  const { place } = useParams(); // Extract "place" parameter from the URL
  const { firestore, user } = useFirebase(); // Access Firestore and user from Firebase context
  const [info, setPlaceInfo] = useState<any>({}); // State to store review details
  const [fileFormat, setFileFormat] = useState("json"); // State to store selected file format

  // Fetch review details in real-time using Firestore
  useEffect(() => {
    if (!firestore || !place || !user) return; // Exit early if required data is missing

    const reviewInfoDoc = doc(firestore, "users", user.uid, "reviews", place); // Reference to the Firestore document

    const unsubscribe = onSnapshot(reviewInfoDoc, (doc) => {
      if (doc.exists()) {
        setPlaceInfo({ ...doc.data(), id: doc.id }); // Update state with document data and ID
      }
    });

    return () => unsubscribe(); // Cleanup Firestore subscription on component unmount
  }, [firestore, user, place]);

  // Define the information array to be mapped
  const reviewInfoItems = [
    {
      title: "Status",
      content: (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          {statusRender(info.status, { width: 50, height: 50 })}
        </div>
      ),
    },
    {
      title: "Average Rating",
      content: (
        <div className="d-flex gap-2 align-items-center my-2">
          <h2 className="m-0">{info.rating ? info.rating : "N/A"}</h2>
          <StarRating rating={info.rating} size={18} />
        </div>
      ),
      subtitle: "Average rating for this place",
    },
    {
      title: "Extracted Reviews",
      content: <h2 className="m-0 my-2">{info.totalReviews || 0}</h2>,
      subtitle: "Count of extracted reviews",
    },
    {
      title: "Spent Time",
      content: <h2 className="m-0 my-2">{/* {spentTime(info)} */}</h2>,
      subtitle: "Time spent for this review",
    },
  ];

  return (
    <div>
      <div className="row g-0">
        {/* Left section: Review details */}
        <div className="col-md-7">
          <div className="d-flex flex-column h-100">
            <h2>{info.title}</h2> {/* Review title */}
            <p className="card-text text-muted">{info.address}</p>{" "}
            {/* Review address */}
            {/* Info list */}
            <ul className="row list-unstyled mt-auto single-review__info">
              {reviewInfoItems.map((item, index) => (
                <li
                  key={index}
                  className={`${
                    index === 0 ? "col-2" : "col"
                  } d-flex flex-column border-end px-3`}
                >
                  <p>{item.title}</p>
                  <div className="d-flex gap-2 align-items-center  my-2">
                    {item.content}
                  </div>
                  {item.subtitle && (
                    <span className="text-muted single-review__info__subtitle">
                      {item.subtitle}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right section: Review screenshot */}
        <div className="col-md-5 rounded">
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              height: 400,
              backgroundImage: `url(${info.screenshot})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></a>
        </div>
      </div>
    </div>
  );
}

export default ReviewInfo;
