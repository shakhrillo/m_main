import { useEffect, useState } from "react"
import "./App.css"
import Button from "react-bootstrap/Button"
import Navbar from "./components/navbar"

import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbWEKCv0vFuretjZhtxrrXBHKgTOy-7cE",
  authDomain: "borderline-dev.firebaseapp.com",
  projectId: "borderline-dev",
  storageBucket: "borderline-dev.appspot.com",
  messagingSenderId: "406001897389",
  appId: "1:406001897389:web:bcf2d6fd7ea1b69c749b24",
  measurementId: "G-YJ9H91CHK1"
};

const fsapp = initializeApp(firebaseConfig);
const db = getFirestore(fsapp);

const App = () => {
  const [reviews, setReviews] = useState([] as any[])
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({} as any)
  const [auth, setAuth] = useState({} as any)
  const [uniqueId, setUniqueId] = useState("")
  // const uniqueId = url.replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    // Sign in anonymously
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Sign in successfully")
        setAuth(auth)
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  }, [])

  useEffect(() => {
    if (!uniqueId) return;
    setInfo({} as any)
    setReviews([])
    const unsubscribe = onSnapshot(doc(db, "reviews", uniqueId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Document data:", docSnapshot.data());
        const data = docSnapshot.data()
        setInfo(data.info || {})
      } else {
        console.log("No such document!");
      }
    }, (error) => {
      console.log("Error getting document:", error);
    });

    const unsubscribeReviews = onSnapshot(collection(db, "reviews", uniqueId, "reviews"), (querySnapshot) => {
      const reviews: any[] = []
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        reviews.push(doc.data())
      });
      setReviews(reviews)
    });

    return () => {
      unsubscribe()
      unsubscribeReviews()
    }
  }, [uniqueId])

  function handleSubmit(e: any) {
    e.preventDefault()
    const url = document.getElementById("url") as HTMLInputElement
    console.log(url.value)

    setUniqueId(url.value.replace(/[^a-zA-Z0-9]/g, ''))

    // Loading spinner
    // document.querySelector(".spinner-border")?.classList.add("d-block");

    const encodeReviewURL = encodeURIComponent(url.value)

    fetch(`http://localhost:3000/review?url=${encodeReviewURL}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        // setReviews(data.messages)
        // setInfo(data.info)
        // Remove spinner
        // document.querySelector(".spinner-border")?.classList.remove("d-block");
      })
  }

  return (
    <div className="bg-light">
      <Navbar />
      <div className={"container mt-4"}>
        <div className="row gap-4">
          <div className="col bg-white rounded p-5 border">
            <div className="row">
              <div className="col">
                <form>
                  <div className="mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-light rounded-1"
                        id="url"
                      />
                    </div>
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
              {info.mainTitle && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{info.mainTitle}</h5>
                    <p className="card-text">{info.mainSubtitle}</p>
                    <p className="card-text">Reviews: {info.mainReview}</p>
                    <a href="">{info.address.name}</a>
                    <p>
                      Lat: {info.address.latitude}, Lng:{" "}
                      {info.address.longitude}
                    </p>
                  </div>
                </div>
              )}
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
                  {reviews.map((review: any, index: number) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          className="img-thumbnail rounded-circle"
                          width="50"
                          src={review.reviewer.photoUrl}
                          alt="user"
                        />
                        {/* <h5>{review.reviewer.name}</h5> */}
                        {/* <small>{review.reviewer.info}</small> */}
                      </td>
                      <td>{review.reviewScore}</td>
                      <td>{review.timeAgo}</td>
                      <td>
                        {review.images.map((image: any, index: number) => (
                          <img
                            className="img-thumbnail"
                            width="100"
                            key={index}
                            src={image}
                            alt="review"
                          />
                        ))}
                      </td>
                      <td>{review.reviewText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={"col-3 bg-white rounded border p-4"}>
            <div className="mb-3">
              <span className={"small fw-light text-muted"}>Information</span>
            </div>
            <div className="d-flex"></div>
            <h5 className="card-title">{info.mainTitle}</h5>
            <p className="card-text">{info.mainSubtitle}</p>
            <p className="card-text">Reviews: {info.mainReview}</p>
            {/* <a href="">{info.address.name}</a> */}
            {/* <p>
              Lat: {info.address.latitude}, Lng: {info.address.longitude}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
