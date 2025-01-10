import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ReviewComments from "../components/review-comments";
import { validateUrlData } from "../services/scrapService";

function SingleReview() {
  const { uid } = useOutletContext<User>();
  const { place } = useParams() as { place: string };
  const [info, setPlaceInfo] = useState<any>({});

  useEffect(() => {
    const sunbscription = validateUrlData(place, uid).subscribe((data) => {
      setPlaceInfo(data);
    });

    return () => {
      sunbscription.unsubscribe();
    };
  }, [place]);

  return (
    <div className="container-fluid">
      <div className="row row-cols-1 g-3">
        <div className="col">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={info.screenshot}
                  className="img-fluid rounded-start"
                  alt="..."
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{info.title}</h5>
                  <p className="card-text">{info.address}</p>
                  <hr />
                  <ul className="list-unstyled">
                    <li>
                      <strong>Status:</strong> {info.status}
                    </li>
                    <li>
                      <strong>Average Rating:</strong>{" "}
                      {info.rating ? info.rating : "N/A"}
                    </li>
                    <li>
                      <strong>Extracted Reviews:</strong>{" "}
                      {info.totalReviews || 0}
                    </li>
                    <li>
                      <strong>Spent Time:</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <ReviewComments />
        </div>
      </div>
    </div>
  );
}

export default SingleReview;
