import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadReviews } from "../../features/reviews/action";

function DashboardView() {
  const dispatch = useAppDispatch();
  
  const db = useAppSelector((state) => state.firebase.db);
  const reviews = useAppSelector((state) => state.reviews.reviews);

  useEffect(() => {
    if (!db) return;
    
    dispatch(loadReviews({ db }))
  }, [db])

  return (
    <div className="container">
      <div className="card my-2">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Map place link</label>
            <input type="text" className="form-control" placeholder="https://" />
          </div>
          <button className="btn btn-primary">Start scrapping</button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
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
                  <td>
                    {review.info.mainTitle}
                  </td>
                  <td>
                    {review.createdAt} - {review.completedAt}
                  </td>
                  <td>
                    <span className={`badge bg-${review.status === 'completed' ? 'success' : review.status === 'pending' ? 'warning' : 'danger'}`}>{review.status}</span>
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-primary">View</button>
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