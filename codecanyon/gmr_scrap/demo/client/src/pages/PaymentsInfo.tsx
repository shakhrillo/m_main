import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { paymentData } from "../services/paymentService";
import {
  IconBrandDocker,
  IconCalendarEvent,
  IconCheck,
  IconCurrencyDollar,
  IconDeviceDesktop,
  IconDeviceSdCard,
  IconNetwork,
  IconReceipt,
  IconServer,
  IconTerminal,
  IconVersions,
  IconX,
} from "@tabler/icons-react";
import { formatAmount } from "../utils/formatAmount";
import { formatDate } from "../utils/formatDate";

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
          <>
            <Col md={9}>
              <Card className="mb-3">
                <CardBody>
                  <Stack
                    direction="horizontal"
                    className="justify-content-between"
                  >
                    <Stack direction={"horizontal"} gap={3}>
                      <IconReceipt size={24} />
                      <CardTitle className="m-0">Receipts</CardTitle>
                    </Stack>
                  </Stack>
                  <Stack className="mt-3">
                    {payment.status === "succeeded" ? (
                      <p>
                        You have successfully paid for the order #{receiptId}
                      </p>
                    ) : (
                      <p>
                        You have successfully paid for the order #{receiptId}
                      </p>
                    )}
                  </Stack>
                  <Stack>
                    <p className="m-0">Receipt from GMRS</p>
                  </Stack>
                  <hr />
                  <Stack
                    direction={"horizontal"}
                    className="justify-content-between my-3"
                  >
                    Id
                    <span>{payment.id}</span>
                  </Stack>
                  <Stack
                    direction={"horizontal"}
                    className="justify-content-between my-3"
                  >
                    Confirmation Method
                    <span>{payment.confirmation_method}</span>
                  </Stack>
                  <Stack
                    direction={"horizontal"}
                    className="justify-content-between my-3"
                  >
                    Currency
                    <span>{payment.currency}</span>
                  </Stack>
                  <Stack
                    direction={"horizontal"}
                    className="justify-content-between my-3"
                  >
                    Description
                    {payment.description ? (
                      <span>{payment.description}</span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </Stack>
                  <Stack
                    direction={"horizontal"}
                    className="justify-content-between"
                  >
                    Invoice
                    {payment.invoice ? (
                      <span>{payment.invoice}</span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <CardHeader className="d-flex align-items-start justify-content-between gap-3">
                  <Stack direction={"horizontal"} gap={3}>
                    <IconCurrencyDollar size={48} className="text-primary" />
                    <Stack className="my-auto">
                      <CardSubtitle>Total</CardSubtitle>
                      <CardTitle className="text-capitalize text-primary m-0">
                        {formatAmount(payment.amount)}{" "}
                        {String(payment.currency).toUpperCase()}
                      </CardTitle>
                    </Stack>
                  </Stack>
                  {payment.status === "succeeded" ? (
                    <Badge pill bg="success">
                      Success
                    </Badge>
                  ) : (
                    <Badge pill bg="danger">
                      Canceled
                    </Badge>
                  )}
                </CardHeader>
                <CardBody>
                  <Stack>
                    <Row className="row-cols-1 g-2">
                      <Col>
                        <Stack direction={"horizontal"} gap={3}>
                          <div className="rounded p-2 text-secondary bg-secondary-subtle">
                            <IconCalendarEvent />
                          </div>
                          <Stack direction={"vertical"}>
                            <strong className="text-muted">Date</strong>
                            <span>{formatDate(payment.created)}</span>
                          </Stack>
                        </Stack>
                      </Col>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};
