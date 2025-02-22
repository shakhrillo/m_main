import { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { paymentsData } from "../services/paymentService";
import { formatAmount } from "../utils/formatAmount";
import { formatDate } from "../utils/formatDate";
import { IconCheck, IconClock, IconCoin, IconCreditCard, IconReceipt, IconUser, IconX } from "@tabler/icons-react";
import { Badge, Breadcrumb, Container, Row, Col } from "react-bootstrap";
import { filter, map } from "rxjs";

export const Receipt = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState<{ id: string; [key: string]: any } | null>(null);

  useEffect(() => {
    if (!receiptId || !auth.currentUser) return;

    console.log(receiptId, auth.currentUser.uid);

    const subscription = paymentsData({ receiptId, uid: auth.currentUser.uid })
      .pipe(
        filter((snapshot) => snapshot && !snapshot.empty),
        map((snapshot) => ({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() }))
      )
      .subscribe((data) => {
        console.log(data);
        setReceipt(data)
      });

    return () => subscription.unsubscribe();
  }, [receiptId, auth.currentUser]);

  if (!receipt) return null;

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/receipts")}>Receipts</Breadcrumb.Item>
        <Breadcrumb.Item active>{receipt.payment_intent || "N/A"}</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col>
          <h5>Payment Receipt</h5>
          <p>#{receipt.payment_intent}</p>
          <div className="d-flex flex-column gap-3">
            {[
              { icon: <IconReceipt size={30} />, label: "Payment Number", value: <a href={receipt.receipt_url} target="_blank" rel="noreferrer">{receipt.id || "N/A"}</a> },
              { icon: <IconClock size={30} />, label: "Payment Date", value: formatDate(receipt.created) || "N/A" },
              { icon: <IconCoin size={30} />, label: "Payment Amount", value: formatAmount(receipt.amount || receipt.amount_total, receipt.currency) },
              { icon: <IconCreditCard size={30} />, label: "Payment Method", value: receipt.payment_method_details?.type || receipt.payment_method_types || "N/A" },
              { icon: receipt.status === "succeeded" || receipt.status === "complete" ? <IconCheck size={30} /> : <IconX size={30} />, label: "Payment Status", value: <Badge bg={receipt.status === "succeeded" || receipt.status === "complete" ? "success" : "danger"}>{receipt.status || "Failed"}</Badge> },
              { icon: <IconUser />, label: "Customer", value: <NavLink to={`/users/${receipt.metadata?.userId}`}>{receipt.customer || "N/A"}</NavLink> }
            ].map(({ icon, label, value }, idx) => (
              <div key={idx} className="d-flex align-items-center">
                {icon}
                <div className="ms-3">
                  <div className="fw-bold text-break">{value}</div>
                  <div className="text-break">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
