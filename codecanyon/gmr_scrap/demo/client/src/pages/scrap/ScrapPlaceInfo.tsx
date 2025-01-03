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
                <hr />
                <strong>
                  Your estimated points for this scraping task is:
                </strong>
                <div className="d-flex justify-content-between mb-3">
                  <span>Reviews</span>
                  <span className="fw-bold">30 coins</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Extract Image URLs</span>
                  <span className="fw-bold">60 coins</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Extract Video URLs</span>
                  <span className="fw-bold">90 coins</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-primary">180 coins</span>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3"
                  disabled={info.rating === undefined || loading}
                >
                  Start Scraping
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
