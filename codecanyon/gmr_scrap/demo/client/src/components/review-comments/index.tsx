import { useEffect, useState } from "react"; // React hook for lifecycle management
import { useOutletContext, useParams } from "react-router-dom"; // React Router hook to get URL parameters
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"; // Firebase Firestore methods
import { useFirebase } from "../../contexts/FirebaseProvider"; // Custom hook to access Firebase context
import { reviewTextRender } from "../../utils/reviewTextRender"; // Utility for rendering review text
import { Table } from "../table"; // Table component to display review data
import ReviewImages from "../review-images"; // ReviewImages component
import ReviewVideos from "../review-videos"; // ReviewVideos component
import { User } from "firebase/auth";
import { scrapData } from "../../services/scrapService";

function ReviewComments() {
  const { place } = useParams() as { place: string };
  const { uid } = useOutletContext<User>();
  const [reviews, setReviews] = useState<any[]>([]); // State to hold the reviews data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to handle error messages
  const [activeTableFilter, setActiveTableFilter] = useState("comments"); // State to track active filter (comments, images, videos)

  useEffect(() => {
    const ubscription = scrapData(place, uid).subscribe((data) => {
      console.log("data", data);
      setReviews(data);
      setLoading(false);
    });

    return () => {
      ubscription.unsubscribe();
    };
  }, []);

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
