import { useState } from "react";
import { startExtractGmapReviews } from "../../services/firebaseService";
import { useFirebase } from "../../contexts/FirebaseProvider";

const steps = [
  {
    title: "Validate URL",
    description: "Enter the URL of the place you want to scrape reviews from.",
  },
  {
    title: "Review scraping",
    description: "Review scraping is in progress. Please wait.",
  },
  {
    title: "Start scraping",
    description: "Review scraping has been completed. You can now download the reviews.",
  },
];

export const ReviewsForm = () => {
  const { user } = useFirebase()
  const [step, setStep] = useState(1);

  const [scrap, setScrap] = useState({
    url: '',
    limit: 5,
    sortBy: 'Most relevant',
    extractImageUrls: false,
    ownerResponse: true,
    onlyGoogleReviews: false,
  });

  const sortByOptions = ["Most Relevant", "Newest", "Lowest rating", "Highest rating"];

  const handleInputChange = (name: string, value: string | number) => {
    setScrap((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    setScrap((prev: any) => ({ ...prev, [name]: !prev[name] }));
  };

  const startScraping = async (e: any) => {
    e.preventDefault();
    console.log("Scraping started with data:", scrap);
    await startExtractGmapReviews(user!.uid, scrap)
  };

  return (
    <div>
      <div className="progress">
        {
          steps.map((s, i) => (
            <div key={i} className={`progress__step ${i === step ? 'active' : ''}`} onClick={() => setStep(i)}>
              <div className="progress__text">
                {s.title}
              </div>
            </div>
          ))
        }
      </div>
      {
        step === 0 ? (
          <div>
            <h3>Review Scraping</h3>
            <p>
              Enter the URL of the place you want to scrape reviews from.
            </p>
            <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
              Learn more
            </a>
            <form>
              <label htmlFor="url">URL</label>
              <input type="text" id="url" name="url" value={scrap.url} onChange={(e) => handleInputChange("url", e.target.value)} placeholder="https://www.google.com/maps/place/..." />

              <button className="primary" onClick={(e) => setStep(1)} type="button">
                Validate URL
              </button>
            </form>
          </div>
        ) : null
      }
      {
        step === 1 ? (
          <div>
            <h3>
              Shefah Hotels
            </h3>
            <p>
              184 reviews and 89 photos
            </p>
            <p>
              315 29th St, Union City, NJ 07087, United States
            </p>
            <br />
            <button className="primary" onClick={(e) => setStep(2)} type="button">
              Confirm
            </button>
            <button className="secondary" onClick={(e) => setStep(0)} type="button">
              Cancel
            </button>
          </div>
        ) : null
      }
      {
        step === 2 ? (
          <div>
            <h3>
              Configuration
            </h3>
            <p>
              Make sure the following information is correct before starting the scraping process.
            </p>

            <form>
              <label htmlFor="limit">Limit</label>
              <input type="number" id="limit" name="limit" value={scrap.limit} onChange={(e) => handleInputChange("limit", e.target.value)} placeholder="5" />

              <label htmlFor="sortBy">Sort by</label>
              <select id="sortBy" name="sortBy" value={scrap.sortBy} onChange={(e) => handleInputChange("sortBy", e.target.value)}>
                {
                  sortByOptions.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))
                }
              </select>

              <label htmlFor="extractImageUrls">Extract image URLs</label>
              <input type="checkbox" id="extractImageUrls" name="extractImageUrls" checked={scrap.extractImageUrls} onChange={() => handleCheckboxChange("extractImageUrls")} />

              <label htmlFor="ownerResponse">Owner response</label>
              <input type="checkbox" id="ownerResponse" name="ownerResponse" checked={scrap.ownerResponse} onChange={() => handleCheckboxChange("ownerResponse")} />

              <label htmlFor="onlyGoogleReviews">Only Google reviews</label>
              <input type="checkbox" id="onlyGoogleReviews" name="onlyGoogleReviews" checked={scrap.onlyGoogleReviews} onChange={() => handleCheckboxChange("onlyGoogleReviews")} />

              <br />

              <button className="primary" onClick={startScraping} type="button">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
                Start Scraping
              </button>

              <br />

              <button className="secondary" onClick={(e) => setStep(1)} type="button">
                Back
              </button>
            </form>
          </div>
        ) : null
      }
    </div>
  );
};
