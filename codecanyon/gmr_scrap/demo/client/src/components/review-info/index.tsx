import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { User } from "firebase/auth";
import { validateUrlData } from "../../services/scrapService";

function ReviewInfo() {
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

  // Define the information array to be mapped
  const reviewInfoItems = [
    {
      title: "Status",
      content: (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          {info.status}
        </div>
      ),
    },
    {
      title: "Average Rating",
      content: (
        <div className="d-flex gap-2 align-items-center my-2">
          <h2 className="m-0">{info.rating ? info.rating : "N/A"}</h2>
          {info.rating}
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
