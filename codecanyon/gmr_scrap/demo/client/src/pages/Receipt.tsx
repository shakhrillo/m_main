import {
  IconCheck,
  IconClock,
  IconCoin,
  IconCreditCard,
  IconReceipt,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Badge,
  Breadcrumb,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { filter, map } from "rxjs";
import { paymentsData } from "../services/paymentService";
import { formatAmount } from "../utils/formatAmount";
import { formatDate } from "../utils/formatDate";
import { getAuth } from "firebase/auth";

export const Receipt = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { receiptId } = useParams() as { receiptId: string };
  const [receipt, setReceipt] = useState({} as any);

  useEffect(() => {
    if (!receiptId || !auth.currentUser) return;

    const subscription = paymentsData({ receiptId, uid: auth.currentUser.uid })
      .pipe(
        filter((snapshot) => !!snapshot),
        filter((snapshot) => !snapshot.empty),
        map((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return data[0];
        }),
      )
      .subscribe((data) => setReceipt(data));

    return () => {
      subscription.unsubscribe();
    };
  }, [receiptId, auth.currentUser]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/receipts");
          }}
        >
          Receipts
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {receipt?.payment_intent || "N/A"}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col>
          <h5>Payment Receipt</h5>
          <p>#{receipt?.payment_intent}</p>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center">
              <IconReceipt size={30} />
              <div className="ms-3">
                <div className="text-break fw-bold">
                  <a
                    href={receipt?.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-end text-break d-flex"
                  >
                    {receipt.number || "N/A"}
                  </a>
                </div>
                <div className="text-break">Payment Number</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <IconClock size={30} />
              <div className="ms-3">
                <div className="text-break fw-bold">
                  {formatDate(receipt.created) || "N/A"}
                </div>
                <div className="text-break">Payment Date</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <IconCoin size={30} />
              <div className="ms-3">
                <div className="text-break fw-bold">
                  {formatAmount(
                    receipt.amount || receipt.amount_total,
                    receipt.currency,
                  )}
                </div>
                <div className="text-break">Payment Amount</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <IconCreditCard size={30} />
              <div className="ms-3">
                <div className="text-break fw-bold">
                  {receipt?.payment_method_details?.type ||
                    receipt?.payment_method_types ||
                    "N/A"}
                </div>
                <div className="text-break">Payment Method</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {receipt.status === "succeeded" ||
              receipt.status === "complete" ? (
                <IconCheck size={30} />
              ) : (
                <IconX size={30} />
              )}
              <div className="ms-3">
                <div className="text-break fw-bold">
                  {receipt.status === "succeeded" ||
                  receipt.status === "complete" ? (
                    <Badge bg="success">{receipt.status}</Badge>
                  ) : (
                    <Badge bg="danger">{receipt.status || "Failed"}</Badge>
                  )}
                </div>
                <div className="text-break">Payment Status</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <IconUser />
              <div className="ms-3">
                <div className="text-break fw-bold">
                  <NavLink to={`/users/${receipt?.metadata?.userId}`}>
                    {receipt?.customer || "N/A"}
                  </NavLink>
                </div>
                <div className="text-break">Customer</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
