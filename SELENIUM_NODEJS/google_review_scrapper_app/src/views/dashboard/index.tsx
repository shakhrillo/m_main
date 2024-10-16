import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";

function DashboardView() {
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [reviews, setReviews] = useState([] as any[]);
  
  const db = useAppSelector((state) => state.firebase.db);

  useEffect(() => {
    if (!db) return;
    setReviews([]);    
    const collectionReviews = collection(db, "reviews");

    onSnapshot(collectionReviews, (querySnapshot) => {
      setReviews([]);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setReviews((prev) => [...prev, {
          ...data,
          id: doc.id,
        }]);
      });
    });
  }, [db]);

  async function startScraping(url: string) {
    const encodeReviewURL = encodeURIComponent(url);
    await fetch(`http://localhost:3000/review?url=${encodeReviewURL}`);
    setScrapingUrl('');
  }

  return (
    <div className="container">
      <div className="card my-2">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Map place link</label>
            <input type="text" className="form-control" placeholder="https://" value={scrapingUrl} onChange={(e) => setScrapingUrl(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => startScraping(scrapingUrl)} disabled={!scrapingUrl}>
            Start scrapping
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">Url</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            reviews && reviews.map((review: any, index: number) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  {
                    review.info ? <td>
                      <h6>
                        {review.info.mainTitle} <i>{review.info.mainReview} reviews</i>
                      </h6>
                      <span className="badge bg-info">
                        {review.info.mainRate}
                      </span>
                    </td> : null
                  }
                  <td>
                    {new Date(review.createdAt).toLocaleString()}
                    <span className="badge bg-danger ms-2">
                      {Math.round((new Date(review.completedAt).getTime() - new Date(review.createdAt).getTime()) / 1000)}s
                    </span>
                  </td>
                  <td>
                    {
                      review.fileUrl ? 
                        <a href={review.fileUrl} className="text-warning">
                          Dowload JSON
                        </a> : null
                    }
                    <br />
                    {
                      review.fileUrlCsv ?
                        <a href={review.fileUrlCsv} className="text-warning">
                          Dowload CSV
                        </a> : null
                    }
                  </td>
                  <td>
                    <span className={`badge bg-${review.status === 'completed' ? 'success' : review.status === 'pending' ? 'warning' : 'danger'}`}>{review.status}</span>
                  </td>
                  <td className="d-flex gap-2">
                    <a className="btn btn-primary" href={`/dashboard/review/${review.id}`}>
                      View
                    </a>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default DashboardView;