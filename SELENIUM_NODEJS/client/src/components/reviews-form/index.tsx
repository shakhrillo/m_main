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
    <form className="geo-dashboard__form">
      <div className="geo-dashboard__row row">
        <div className="geo-dashboard__column col">
          <TextInput
            label="Sharable URL"
            name="url"
            value={scrap.url}
            onChange={(e: any) => handleInputChange("url", e.target.value)}
            placeholder="Place URL"
          />
        </div>
        <div className="geo-dashboard__column col">
          <TextInput
            label="Extract limit"
            name="limit"
            value={scrap.limit}
            onChange={(e: any) => handleInputChange("limit", Number(e.target.value))}
            placeholder="Extract limit"
            type="number"
          />
        </div>
        <div className="geo-dashboard__column col">
          <SelectInput
            label="Sort by"
            name="sortBy"
            value={scrap.sortBy}
            onChange={(e: any) => handleInputChange("sortBy", e.target.value)}
            options={sortByOptions}
          />
        </div>
      </div>
      <div className="geo-dashboard__filter">
        <div className="geo-dashboard__form-group form-group">
          <div className="geo-dashboard__checkbox-group form-group">
            <CheckboxInput
              label="Extract image urls"
              id="extractImageUrls"
              checked={scrap.extractImageUrls}
              onChange={() => handleCheckboxChange("extractImageUrls")}
              iconClass="bi bi-image"
            />
            <CheckboxInput
              label="Owner response"
              id="ownerResponse"
              checked={scrap.ownerResponse}
              onChange={() => handleCheckboxChange("ownerResponse")}
              iconClass="bi bi-megaphone"
            />
            <CheckboxInput
              label="Only Google reviews"
              id="onlyGoogleReviews"
              checked={scrap.onlyGoogleReviews}
              onChange={() => handleCheckboxChange("onlyGoogleReviews")}
              iconClass="bi bi-google"
            />
          </div>
        </div>
        <button
          className="geo-dashboard__start-btn geo-btn-primary btn btn-primary"
          onClick={startScraping}
        >
          <i className="bi bi-play-fill"></i> Start
        </button>
      </div>
    </form>
  );
};
