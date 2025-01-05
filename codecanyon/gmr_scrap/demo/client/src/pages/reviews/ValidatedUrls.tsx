import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"; // Firestore imports for document snapshot
import React, { useEffect, useState } from "react"; // React imports for state and effect handling
import { useNavigate } from "react-router-dom"; // Hook for navigation
import Loader from "../../components/loader"; // Loader component to show while loading data
import { Table } from "../../components/table"; // Custom Table component for displaying data
import { useFirebase } from "../../contexts/FirebaseProvider"; // Context for Firebase integration
import { formatTimestamp } from "../../utils/formatTimestamp"; // Utility to format timestamps
import { reviewsCountRender } from "../../utils/reviewsCountRender"; // Utility for rendering reviews count
import { spentTime } from "../../utils/spentTime"; // Utility for calculating spent time
import { statusRender } from "../../utils/statusRender"; // Utility for rendering status

const ValidatedUrls: React.FC = () => {
  const navigate = useNavigate(); //Hook for navigation
  const { firestore, user } = useFirebase(); // Firebase context to get firestore and user data

  // States for managing dashboard data
  const [info, setInfo] = useState<any>({});
  const [completedReviews, setCompletedReviews] = useState<any[]>([]); // List of complated reviews
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [activeTableFilter, setActiveTableFilter] = useState("all"); // Active table filter

  const stats = [
    { label: "All comments", value: info.totalReviews || "0" },
    { label: "Owner responses", value: info.totalOwnerReviews || "0" },
    { label: "User comments", value: info.totalUserReviews || "0" },
    { label: "Images", value: info.totalImages || "0" },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      text: "Status",
      field: "status",
      render: (row: any) => statusRender(row.status, { width: 20, height: 20 }), // Render status icon
    },
    {
      text: "Place",
      field: "title",
      render: (row: any) => (
        <a
          className="d-inline-block text-truncate"
          style={{ maxWidth: "200px" }}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/reviews/${row.id}`); // Navigate to reviews page on click
          }}
        >
          {row.title || row.url} {/* Display place title or URL */}
        </a>
      ),
    },
    {
      text: "Limit",
      field: "limit",
      render: (row: any) => <span>{row.limit}</span>, // Display limit value
    },
    {
      text: "Date",
      field: "createdAt",
      render: (row: any) => <span>{formatTimestamp(row.createdAt)}</span>, // Format creation date
    },
    {
      text: "Updated",
      field: "updatedAt",
      render: (row: any) => <span>{formatTimestamp(row.updatedAt)}</span>, // Format update date
    },
    {
      text: "Reviews",
      field: "totalReviews",
      render: (row: any) => reviewsCountRender(row), // Render review count
    },
    {
      text: "Time",
      field: "timeSpent",
      render: (row: any) => spentTime(row), // Render time spent
    },
    {
      text: "",
      field: "csv",
      render: (row: any) => <a href={row.csvUrl}>Csv</a>, // Provide CSV download
    },
    {
      text: "",
      field: "json",
      render: (row: any) => <a href={row.jsonUrl}>JSON</a>, // // Provide JSON download
    },
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
      orderBy("createdAt", "desc"), // Specify "desc" for descending order or "asc" for ascending order
      // Filter by type
      where("type", "==", "info"),
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      setCompletedReviews(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      );
      setLoading(() => false);
    });

    return unsubscribe;
  }, [firestore, user]);

  // Fetch app info from Firestore
  useEffect(() => {
    if (!firestore || !user) return;

    console.log("user", `users/${user.uid}/settings/statistics`);
    const docRef = doc(firestore, `users/${user.uid}/settings/statistics`); // Get app info document
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setInfo(doc.data() || {}); // Update state with the app info
      setLoading(() => false); // Set loading to false once data is fetched
      console.log("info", doc.data());
    });
    return unsubscribe; // Cleanup on unmount
  }, [firestore, user]);

  // Filter the table data based on the active filter
  const filteredReviews = completedReviews.filter((review) => {
    if (activeTableFilter === "all") return true; // Show all reviews
    return review.status === activeTableFilter; // Filter by status
  });

  return (
    <div className="container-fluid">
      {loading ? (
        // Show loader while data is being fetched
        <Loader cover="full" version={2} />
      ) : (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row row-cols-4">
                  {stats.map((stat, index) => (
                    <div className="col" key={index}>
                      <span className="text-muted">{stat.label}</span>
                      <span className="d-block fs-1">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
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
                  className={`btn btn-secondary ${
                    activeTableFilter === filter ? "active" : ""
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table for displaying reviews based on active filter */}
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                <Table tableHeader={tableColumns} tableBody={filteredReviews} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatedUrls;
