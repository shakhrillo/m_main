import {
  IconMessageReply,
  IconPhoto,
  IconPlayerPlay,
  IconStarFilled,
} from "@tabler/icons-react";
import { createElement, JSX, useState } from "react";

interface IInfo {
  address: string;
  rating: number;
  reviews: number;
  screenshot: string;
  title: string;
}

interface IProps {
  info: IInfo;
}

function ScrapPlaceInfo({ info }: IProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(30);
  const [extractImageUrls, setExtractImageUrls] = useState(false);
  const [extractVideoUrls, setExtractVideoUrls] = useState(false);
  const [ownerResponse, setOwnerResponse] = useState(true);

  function calculatePoints() {
    let points = limit || 0;

    if (points <= 0) {
      return "";
    }

    if (extractImageUrls) {
      points += limit * 2;
    }

    if (extractVideoUrls) {
      points += limit * 3;
    }

    if (ownerResponse) {
      points += limit;
    }

    return `${points} points`;
  }

  return (
    <div className="row">
      <div className="col">
        <div className="card scrap-info">
          <div className="row g-0">
            <div className="col-md-12">
              <div
                style={{
                  backgroundImage: "url(" + info.screenshot + ")",
                }}
                className="place-preview"
              ></div>
            </div>
            <div className="col-md-12">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <IconStarFilled size={16} className="text-warning" />
                  <span>{info.rating || "N/A"}</span>
                  <span>
                    ({Number(info.reviews || 0).toLocaleString()} reviews)
                  </span>
                </div>
                <h5 className="card-title">
                  <span>{info.title || "Google Maps"}</span>
                </h5>
                <p className="card-text">{info.address}</p>
                <hr />
                <div className="form-group">
                  <label className="form-label">Maximum reviews</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    disabled={loading || info.rating === undefined}
                    className="form-control"
                  />
                </div>

                <div className="list-group mt-3 list-group-flush">
                  {[
                    {
                      title: "Images",
                      subTitle:
                        "The points will be deducted for each image extracted from the reviews.",
                      icon: IconPhoto,
                      point: 2,
                      checked: extractImageUrls,
                    },
                    {
                      title: "Videos",
                      subTitle:
                        "The points will be deducted for each video extracted from the reviews.",
                      icon: IconPlayerPlay,
                      point: 3,
                      checked: extractVideoUrls,
                    },
                    {
                      title: "Owner Response",
                      subTitle:
                        "The points will be deducted for each owner response extracted from the reviews.",
                      icon: IconMessageReply,
                      point: 1,
                      checked: ownerResponse,
                    },
                  ].map((item, index) => (
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={item.title}
                        checked={item.checked}
                        id={item.title}
                        onChange={(e) => {
                          switch (item.title) {
                            case "Images":
                              setExtractImageUrls(e.target.checked);
                              break;
                            case "Videos":
                              setExtractVideoUrls(e.target.checked);
                              break;
                            case "Owner Response":
                              setOwnerResponse(e.target.checked);
                              break;
                          }
                        }}
                        disabled={info.rating === undefined || loading}
                      />
                      <label className="form-check-label" htmlFor={item.title}>
                        {item.title}

                        <span className="badge bg-primary ms-2">
                          {item.point} point / each
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary mt-3"
                  disabled={info.rating === undefined || loading}
                >
                  Start Scraping
                  <span className="badge bg-light text-dark ms-2">
                    {calculatePoints()}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrapPlaceInfo;
