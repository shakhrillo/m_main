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
import { receiptData } from "../services/paymentService";
import { formatAmount } from "../utils/formatAmount";
import { formatDate } from "../utils/formatDate";

export const Receipt = () => {
  const navigate = useNavigate();
  const { receiptId } = useParams() as { receiptId: string };
  const [receipt, setReceipt] = useState({} as any);

  useEffect(() => {
    if (!receiptId) return;

    const subscription = receiptData({ receiptId })
      .pipe(
        filter((data) => data && data.length > 0),
        map((data) => data[0]),
      )
      .subscribe((data) => {
        setReceipt(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [receiptId]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item>Reports</Breadcrumb.Item>
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
          <Card>
            <CardBody>
              <CardTitle>Payment Receipt</CardTitle>
              <CardSubtitle>#{receipt?.payment_intent}</CardSubtitle>
              <hr />
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
