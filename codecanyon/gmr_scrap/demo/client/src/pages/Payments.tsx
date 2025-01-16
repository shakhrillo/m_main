import {
  IconAlertCircle,
  IconCoin,
  IconCoins,
  IconInfoCircle,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { buyCoins, buyCoinsData } from "../services/paymentService";
import {
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
  ListGroup,
  Row,
  Stack,
} from "react-bootstrap";

export const Payments = () => {
  const { uid } = useOutletContext<User>();

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [coinId, setCoinId] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const unsubscribe = buyCoinsData(coinId, uid).subscribe((data) => {
      const url = data?.url;
      if (url) {
        window.location.href = url;
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
      const id = await buyCoins(uid, Number(amount) * 100);
      setCoinId(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Purchase Coins</CardTitle>
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
                    pattern="^([1-9][0-9]|[1-9][0-9]{2}|1000)$"
                    placeholder="Enter amount"
                    required
                  />
                  <FormControl.Feedback type={"invalid"}>
                    <IconAlertCircle className="me-2" size={20} />
                    Please enter a valid amount.
                  </FormControl.Feedback>
                  <FormText>
                    The minimum amount you can purchase is between 10 and 1000.
                  </FormText>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardBody>
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
            </CardBody>
          </Card>
          <Card>
            <CardBody>
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
        <Col md={4}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Summary</CardTitle>
              <Stack
                direction="horizontal"
                className="my-2 justify-content-between"
              >
                Coins
                <Stack
                  direction={"horizontal"}
                  className="align-items-center gap-1"
                >
                  {amount} <IconCoins size={20} />
                </Stack>
              </Stack>
              <Stack
                direction={"horizontal"}
                className="my-2 justify-content-between"
              >
                USD
                <Stack
                  direction={"horizontal"}
                  className="align-items-center gap-1"
                >
                  {Number(amount || 0) / 10} <IconCoin size={20} />
                </Stack>
              </Stack>
              <Stack
                direction={"horizontal"}
                className="my-2 justify-content-between"
              >
                <span>Discount</span>
                15%
              </Stack>
              <Stack
                direction={"horizontal"}
                className="my-2 justify-content-between"
              >
                <span>Tax</span>
                0%
              </Stack>
              <hr />
              <Stack direction={"horizontal"} className="d-flex my-2">
                <span>Total</span>
                500
              </Stack>
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
