import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { receiptData } from "../services/paymentService";

export const Receipts = () => {
  const { uid } = useOutletContext<User>();
  const [history, setHistory] = useState([] as any[]);

  useEffect(() => {
    const unsubscribe = receiptData(uid).subscribe((data) => {
      console.log(data);
      setHistory(data);
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.status}</td>
                      <td>{item.amount}</td>
                      <td>{item.id}</td>
                      <td>
                        <a href={item.receiptUrl} target="_blank">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
