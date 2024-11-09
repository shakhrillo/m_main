import { useState } from "react";
import { startExtractGmapReviews } from "../../services/firebaseService";
import { useFirebase } from "../../contexts/FirebaseProvider";

// Reusable TextInput component
const TextInput = ({ label, name, value, onChange, placeholder, type = "text" }: { label: string, name: string, value: string | number, onChange: any, placeholder: string, type?: string }) => (
  <div className="geo-dashboard__form-group form-group">
    <label className="geo-dashboard__input-label" htmlFor={name}>
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="geo-dashboard__input geo-input form-control"
      id={name}
    />
  </div>
);

// Reusable SelectInput component
const SelectInput = ({ label, name, value, onChange, options } : { label: string, name: string, value: string, onChange: any, options: string[] }) => (
  <div className="geo-dashboard__form-group form-group">
    <label className="geo-dashboard__input-label" htmlFor={name}>
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="geo-dashboard__input geo-input form-select"
      id={name}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Reusable CheckboxInput component
const CheckboxInput = ({ label, id, checked, onChange, iconClass } : { label: string, id: string, checked: boolean, onChange: any, iconClass: string }) => (
  <div className="geo-dashboard__checkbox-item">
    <input
      checked={checked}
      onChange={onChange}
      type="checkbox"
      className="geo-dashboard__checkbox-input btn-check"
      id={id}
    />
    <label className="geo-dashboard__checkbox-label btn geo-btn-transparent" htmlFor={id}>
      <i className={iconClass}></i> {label}
    </label>
  </div>
);

export const ReviewsForm = () => {
  const { user } = useFirebase()
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
    <div className="steps">
      <div className="step-progress">
        <div className="step-progress__step active">
          <div className="step-progress__text">
            Validate URL
          </div>
        </div>
        <div className="step-progress__step active">
          <div className="step-progress__text">
            Review scraping
          </div>
        </div>
        <div className="step-progress__step active">
          <div className="step-progress__text">
            Start scraping
          </div>
        </div>
      </div>

      <div className="step">
        <h4>Google Maps Place sharable URL</h4>
        <p>Enter the URL of the Google Maps place you want to scrape reviews from.</p>
        <div className="step__form">
          <div className="form-group">
            <label>Place URL</label>
            <input type="text" className="form-control" placeholder="https://goo.gl/maps/..." />
          </div>
          <button className="btn btn-primary">
            Validate
          </button>
        </div>
        <div className="step__hint">
          <i className="bi bi-info-circle-fill"></i>
          <a href="https://support.google.com/maps/answer/144361?co=GENIE.Platform%3DDesktop&hl=en" target="_blank" rel="noreferrer">
            You can find the sharable URL by clicking the "Share" button on the Google Maps place page.
          </a>
        </div>
      </div>
    </div>
  );
};
