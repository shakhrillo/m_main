import { useEffect, useState } from "react"; // React hook for lifecycle management
import { useParams } from "react-router-dom"; // React Router hook to get URL parameters
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"; // Firebase Firestore methods
import { useFirebase } from "../../contexts/FirebaseProvider"; // Custom hook to access Firebase context
import { reviewTextRender } from "../../utils/reviewTextRender"; // Utility for rendering review text
import { Table } from "../table"; // Table component to display review data
import ReviewImages from "../review-images"; // ReviewImages component
import ReviewVideos from "../review-videos"; // ReviewVideos component

function ReviewComments() {
  const { place } = useParams(); // Extract 'place' from URL parameters to identify which review to fetch
  const { firestore, user } = useFirebase(); // Access firestore and user data from Firebase context
  const [reviews, setReviews] = useState<any[]>([]); // State to hold the reviews data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to handle error messages
  const [activeTableFilter, setActiveTableFilter] = useState("comments"); // State to track active filter (comments, images, videos)

  // Fetch reviews from Firestore when the component mounts or when 'firestore', 'user', or 'place' changes
  useEffect(() => {
    if (!firestore || !place || !user) return; // Exit if any required data (firestore, place, or user) is missing

    // Create a reference to the 'reviews' collection in Firestore for the specific place and user
    const reviewsRef = collection(
      firestore,
      "users",
      user.uid,
      "reviews",
      place,
      "reviews",
    );
    const q = query(reviewsRef, orderBy("time", "asc")); // Create a query to order reviews by time in ascending order

    // Set up a real-time listener for the reviews collection
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Map the snapshot data to an array of review objects
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Include the document data (review data)
        }));

        setReviews(reviewsData); // Update state with the fetched reviews
        setLoading(false); // Set loading state to false once data is loaded
        setError(null); // Clear any existing error
      },
      (err) => {
        setLoading(false); // Stop loading if there's an error
        setError(err.message); // Set error message
      },
    );
    // Cleanup the listener when the component is unmounted or dependencies change
    return unsubscribe;
  }, [firestore, user, place]); // Re-run the effect when 'firestore', 'user', or 'place' changes

  // Define the table header structure for displaying review data
  const tableHeader = [
    {
      text: "Date", // Column title for the 'Date' column
      field: "date", // Field name for the date
      render: (row: any) => <span>{row.date}</span>, // Render date in a span element
    },
    {
      text: "Rating", // Column title for the 'Rating' column
      field: "rating", // Field name for the rating
      render: (row: any) => <span>{row.rating}</span>, // Render rating in a span element
    },
    {
      text: "Review", // Column title for the 'Review' column
      field: "review", // Field name for the review text
      render: (row: any) => <span>{reviewTextRender(row.review)}</span>, // Use utility function to render review text
    },
    {
      text: "QA", // Column title for the 'QA' column
      field: "qa", // Field name for the QA list
      render: (row: any) => (
        // Render each QA entry as a list item
        <ul>
          {row.qa.map((qa: any, index: number) => (
            <li key={index} className="list-group-item">
              <small className="text-nowrap">{qa}</small>
            </li>
          ))}
        </ul>
      ),
    },
    {
      text: "Response", // Column title for the 'Response' column
      field: "response", // Field name for the response text
      render: (row: any) => <span>{reviewTextRender(row.response)}</span>, // Use utility function to render response text
    },
  ];

  const FilterButtons = () => (
    <div
      className="btn-group mb-3"
      role="group"
      aria-label="Default button group"
    >
      {["comments", "images", "videos"].map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => setActiveTableFilter(filter)}
          className={`btn btn-outline-primary ${
            activeTableFilter === filter ? "active" : ""
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );

  // Conditional rendering based on loading state, error, and active filter
  return loading ? (
    <div>Loading...</div> // Show loading text while data is being fetched
  ) : error ? (
    <div>{error}</div> // Show error message if there was an issue fetching data
  ) : (
    <div>
      <FilterButtons />
      <div className="card">
        <div className="card-body">
          {activeTableFilter === "comments" ? (
            <Table tableHeader={tableHeader} tableBody={reviews} /> // Display the table if 'comments' filter is active
          ) : activeTableFilter === "images" ? (
            <ReviewImages /> // Display the ReviewImages component if 'images' filter is active
          ) : (
            <ReviewVideos /> // Display the ReviewVideos component if 'videos' filter is active
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewComments;
