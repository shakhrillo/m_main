import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { receiptData } from "../services/paymentService";
import { formatTimestamp } from "../utils/formatTimestamp";
import { formatAmount } from "../utils/formatAmount";
import { Container } from "react-bootstrap";

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
    <Container>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Created</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{formatTimestamp(item.createdAt)}</td>
                      <td>{item.type}</td>
                      <td>
                        {item.status === "succeeded" ? (
                          <span className="text-success">Succeeded</span>
                        ) : (
                          <span className="text-danger">Failed</span>
                        )}
                      </td>
                      <td>{formatAmount(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
