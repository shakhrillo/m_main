import { IconMessageReply, IconMessages, IconPhoto } from "@tabler/icons-react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"; // Firestore imports for document snapshot
import React, { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import { useNavigate } from "react-router-dom"; // Hook for navigation
import Loader from "../components/loader"; // Loader component to show while loading data
import { useFirebase } from "../contexts/FirebaseProvider"; // Context for Firebase integration
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { spentTime } from "../utils/spentTime"; // Utility for calculating spent time
import { statusRender } from "../utils/statusRender"; // Utility for rendering status

const ValidatedURLs: React.FC = () => {
  const navigate = useNavigate(); //Hook for navigation
  const { firestore, user } = useFirebase(); // Firebase context to get firestore and user data

  // States for managing ValidatedURLs data
  const [info, setInfo] = useState<any>({});
  const [reviews, setReviews] = useState<any[]>([]); // List of complated reviews
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [activeTableFilter, setActiveTableFilter] = useState("all"); // Active table filter

  const stats = [
    {
      label: "All comments",
      icon: IconMessages,
      value: info.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      value: info.totalOwnerReviews || "0",
    },
    {
      label: "User comments",
      icon: IconMessages,
      value: info.totalUserReviews || "0",
    },
    { label: "Images", icon: IconPhoto, value: info.totalImages || "0" },
  ];

  useEffect(() => {
    setLoading(() => true);
    if (!firestore || !user) return;

    const collectionReviews = collection(
      firestore,
      `users/${user.uid}/reviews`,
    );

    const reviewsQuery = query(
      collectionReviews,
      orderBy("createdAt", "desc"),
      where("type", "==", "info"),
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("data", data);
      setReviews(data);
      setLoading(() => false);
    });

    return unsubscribe;
  }, [firestore, user]);

  useEffect(() => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/settings/statistics`);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      setInfo(doc.data() || {});
      setLoading(() => false);
    });

    return unsubscribe;
  }, [firestore, user]);

  return (
    <div className="container-fluid">
      {loading ? (
        // Show loader while data is being fetched
        <Loader cover="full" version={2} />
      ) : (
        <div className="row g-3">
          <div className="col-12">
            {/*---Extracted reviews status---*/}
            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="w-100 text-center">
                      {createElement(stat.icon, { size: 50, strokeWidth: 1 })}
                      <span className="d-block fs-3">{stat.value}</span>
                      <span className="d-block">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/*---End: Extracted reviews status---*/}
          </div>

          {/* Table for displaying reviews based on active filter */}
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Default button group"
                >
                  {["all", "completed", "pending", "filed"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveTableFilter(filter)}
                      className={`btn btn-primary ${
                        activeTableFilter === filter ? "active" : ""
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="table-responsive mt-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Place</th>
                        <th scope="col">Limit</th>
                        <th scope="col">Date</th>
                        <th scope="col">Reviews</th>
                        <th scope="col">Images</th>
                        <th scope="col">Videos</th>
                        <th scope="col">Time</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/reviews/${review.id}`);
                              }}
                            >
                              <span className="d-flex align-items-center">
                                {statusRender(review.status, {
                                  width: 18,
                                  height: 18,
                                })}
                                <div className="ms-1">
                                  {review.title || review.url}
                                </div>
                              </span>
                              <span className="d-block">{review.address}</span>
                            </a>
                          </td>
                          <td>{review.limit}</td>
                          <td>
                            <span>
                              {formatTimestamp(review.createdAt).time}
                            </span>
                            <span className="d-block">
                              {formatTimestamp(review.createdAt).date}
                            </span>
                          </td>
                          <td>
                            {Number(
                              review.totalReviews || "0",
                            ).toLocaleString()}{" "}
                            / {Number(review.reviews || "0").toLocaleString()}
                          </td>
                          <td>{review.totalImages || "0"}</td>
                          <td>{review.totalVideos || "0"}</td>
                          <td>{spentTime(review)}</td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <a href={review.csvUrl}>Csv</a>
                              <a href={review.jsonUrl}>JSON</a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatedURLs;
