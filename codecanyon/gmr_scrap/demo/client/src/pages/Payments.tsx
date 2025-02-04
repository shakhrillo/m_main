import {
  IconAlertCircle,
  IconCoin,
  IconCoins,
  IconInfoCircle,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { filter, take } from "rxjs";
import { buyCoins, buyCoinsData } from "../services/paymentService";
import { settingValue } from "../services/settingService";

export const Payments = () => {
  const { uid } = useOutletContext<User>();

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [coinId, setCoinId] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const subscription = settingValue({ tag: "cost", type: "coin" })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        setCost(data.value);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!coinId) return;

    const unsubscribe = buyCoinsData(coinId, uid).subscribe((data) => {
      const url = data?.url;
      const error = data?.error;

      console.log(data);

      if (url) {
        window.location.href = url;
      }

      if (error) {
        setError(error);
        setLoading(false);
        setCoinId("");
        setAmount("");
        setIsFormValid(false);
      }
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [coinId]);

  useEffect(() => {
    if (!amount) return;

    const validateForm = document.getElementById(
      "validateForm",
    ) as HTMLFormElement;
    if (validateForm) {
      validateForm.classList.add("was-validated");
    }

    const isValid = validateForm?.checkValidity();
    setIsFormValid(isValid);
  }, [amount]);

  async function handlePurchase() {
    setLoading(true);
    try {
      const id = await buyCoins(uid, Number(amount) * cost);
      setCoinId(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item>Reports</Breadcrumb.Item>
        <Breadcrumb.Item active>Buy Coins</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={9}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Purchaseasd Coins</CardTitle>
              <Form noValidate id="validateForm" className="needs-validation">
                <FormGroup className="mb-3" controlId="amount">
                  <FormLabel>Amount</FormLabel>
                  <FormControl
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmount(Number(value) ? value : "");
                    }}
                    pattern="^[1-9]\d*$"
                    placeholder="Enter amount"
                    className="mb-2"
                    required
                  />
                  <FormControl.Feedback type={"invalid"}>
                    <IconAlertCircle className="me-2" />
                    {error || "Please enter a valid amount."}
                  </FormControl.Feedback>
                  <FormText className={error ? "d-none" : ""}>
                    <IconInfoCircle className="me-2" />
                    There might be restrictions on the minimum and maximum from
                    the Stripe API.
                  </FormText>
                </FormGroup>
              </Form>
              <hr />
              <Row>
                <Col xs="auto">
                  <IconCoins size={40} />
                </Col>
                <Col>
                  <CardTitle>Coins explained</CardTitle>
                  <CardText>
                    Coins are the currency used to purchase data from the
                    website. You can purchase coins in the following ways:
                  </CardText>
                  <ul>
                    <li>
                      <strong>Free Coins:</strong> You can earn coins by
                      participating in the website's activities.
                    </li>
                    <li>
                      <strong>Purchase Coins:</strong> You can purchase coins
                      using the payment methods provided.
                    </li>
                  </ul>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs={"auto"}>
                  <IconInfoCircle size={40} />
                </Col>
                <Col>
                  <CardTitle>Cancellation and Refund Policy</CardTitle>
                  <CardText>
                    Once you have purchased coins, you cannot cancel the
                    purchase or request a refund. Please be sure to purchase
                    coins after confirming the amount.
                  </CardText>
                  <CardText>
                    If you have purchased coins by mistake, please contact us
                    immediately. We will refund the coins you purchased.
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Summary</CardTitle>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <IconCoins size={30} />
                  <div className="ms-3">
                    <div className="text-break fw-bold">{amount || 0}</div>
                    <div className="text-break">Coins</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <IconCoin size={30} />
                  <div className="ms-3">
                    <div className="text-break fw-bold">
                      {(Number(amount || 0) * cost).toFixed(2)}
                    </div>
                    <div className="text-break">Price</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <FormGroup className="mt-3" controlId="terms">
                <FormCheck
                  type="checkbox"
                  label={
                    <>
                      I agree to the{" "}
                      <a href="#" target="_blank">
                        terms and conditions
                      </a>
                    </>
                  }
                  required
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                />
              </FormGroup>
              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={handlePurchase}
                disabled={!isTermsAccepted || loading || !isFormValid}
              >
                Purchase
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
