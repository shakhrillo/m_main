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
import { useSearchParams } from "react-router-dom";
import { paymentData } from "../services/paymentService";
import { IconCheck, IconReceipt } from "@tabler/icons-react";
import { formatAmount } from "../utils/formatAmount";

export const PaymentsSuccess = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState({} as any);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const paymentDataSubscription = paymentData(sessionId).subscribe((data) => {
      console.log(data);
      setPayment(data);
    });

    return () => {
      paymentDataSubscription.unsubscribe();
    };
  }, [searchParams]);

  return (
    <Container>
      <Row>
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
                <div className="bg-primary d-inline-block rounded">
                  <IconCheck size={48} className="text-success" />
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
      </Row>
    </Container>
  );
};
