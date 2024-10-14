import { useState } from "react";
import "./App.css"
import Button from 'react-bootstrap/Button';

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({} as any);

  function handleSubmit(e: any) {
    e.preventDefault();
    const url = document.getElementById("url") as HTMLInputElement;
    console.log(url.value);

    // Loading spinner
    // document.querySelector(".spinner-border")?.classList.add("d-block");

    const encodeReviewURL = encodeURIComponent(url.value);

    fetch(`http://localhost:3000/review?url=${encodeReviewURL}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setReviews(data.messages);
        setInfo(data.info);
        // Remove spinner
        // document.querySelector(".spinner-border")?.classList.remove("d-block");
      });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Google Review Scrapper</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">Enter Google Maps URL</label>
              <input type="text" className="form-control" id="url" />
            </div>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </form>
        </div>
      </div>
      {/* Preloader */}
      <div className="row">
        <div className="spinner-border text-primary d-none" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="row my-3">
        {
          info.mainTitle && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {info.mainTitle}
                </h5>
                <p className="card-text">{info.mainSubtitle}</p>
                <p className="card-text">Reviews: {info.mainReview}</p>
                <a href="">
                  {info.address.name}
                </a>
                <p>
                  Lat: {info.address.latitude}, Lng: {info.address.longitude}
                </p>
              </div>
            </div>
          )
        }
      </div>
      <div className="row">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Score</th>
              <th scope="col">Time</th>
              <th scope="col">Images</th>
              <th scope="col">Content</th>
            </tr>
          </thead>
          <tbody>
            {
              reviews.map((review: any, index: number) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img 
                      className="img-thumbnail rounded-circle"
                      width="50"
                      src={review.reviewer.photoUrl} 
                      alt="user"
                    />
                    <h5>
                      {review.reviewer.name}
                    </h5>
                    <small>
                      {review.reviewer.info}
                    </small>
                  </td>
                  <td>
                    {review.reviewScore}
                  </td>
                  <td>
                    {review.timeAgo}
                  </td>
                  <td>
                    {
                      review.images.map((image: any, index: number) => (
                        <img 
                          className="img-thumbnail"
                          width="100"
                          key={index}
                          src={image} 
                          alt="review"
                        />
                      ))
                    }
                  </td>
                  <td>{review.content}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
