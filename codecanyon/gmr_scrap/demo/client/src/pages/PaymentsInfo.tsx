import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { paymentData } from "../services/paymentService";
import { IconCheck, IconReceipt, IconX } from "@tabler/icons-react";
import { formatAmount } from "../utils/formatAmount";

export const PaymentsInfo = () => {
  const { receiptId } = useParams() as { receiptId: string };
  const [payment, setPayment] = useState({} as any);

  useEffect(() => {
    if (!receiptId) return;

    const paymentDataSubscription = paymentData(receiptId).subscribe((data) => {
      console.log(data);
      setPayment(data);
    });

    return () => {
      paymentDataSubscription.unsubscribe();
    };
  }, [receiptId]);

  return (
    <Container>
      <Row>
        {!payment ? (
          <Col>
            <Card>
              <CardBody>No payment found</CardBody>
            </Card>
          </Col>
        ) : (
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Stack direction="horizontal" gap={3}>
                  <IconReceipt size={48} />
                  <Stack>
                    <CardTitle className="m-0">Purchase Coins</CardTitle>
                    <Stack direction="horizontal" gap={1}>
                      <strong>Amount:</strong>{" "}
                      {formatAmount(payment.amount_total)}
                      {payment.currency}
                    </Stack>
                  </Stack>
                  <div
                    className={`rounded-circle ${
                      payment.status === "succeeded"
                        ? "bg-success-subtle text-success"
                        : "bg-danger-subtle text-danger"
                    }`}
                  >
                    {payment.status === "succeeded" ? (
                      <IconCheck size={48} />
                    ) : (
                      <IconX size={48} />
                    )}
                  </div>
                </Stack>
                <hr />
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(payment).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td style={{ maxWidth: "400px" }}>
                          {Array.isArray(value) ? (
                            <ul>
                              {value.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : typeof value === "object" && value !== null ? (
                            <pre>{JSON.stringify(value, null, 2)}</pre>
                          ) : (
                            value?.toString() || "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};
