import { IconAlertCircle, IconCoin, IconCoins, IconInfoCircle } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, CardBody, CardSubtitle, CardTitle, Col, Container, Form, FormCheck, FormControl, FormGroup, FormText, Row, Stack } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { filter, take } from "rxjs";
import { buyCoins, buyCoinsData } from "../services/paymentService";
import { settingValue } from "../services/settingService";

/**
 * View for purchasing coins.
 * @returns Component.
 */
export const Payments = () => {
  const { uid } = useOutletContext<User>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [coinId, setCoinId] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [cost, setCost] = useState(1);

  useEffect(() => {
    const subscription = settingValue({ tag: "cost", type: "coin" }).pipe(filter(Boolean), take(1))
      .subscribe((data) => setCost(data.value || 1));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!coinId) return;

    const unsubscribe = buyCoinsData(coinId, uid).subscribe((data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        setError(data.error);
        resetForm();
      }
    });

    return () => unsubscribe.unsubscribe();
  }, [coinId]);

  useEffect(() => {
    if (!amount) return;

    const form = document.getElementById("validateForm") as HTMLFormElement;
    if (form) {
      form.classList.add("was-validated");
      setIsFormValid(form.checkValidity());
    }
  }, [amount]);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const id = await buyCoins(uid, Number(amount), Number(amount) * cost);
      setCoinId(id);
    } catch (error) {
      console.error(error);
      setError("Purchase failed. Try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setCoinId("");
    setAmount("");
    setIsFormValid(false);
    setLoading(false);
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Buy Coins</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={9}>
          <Card className="mb-3">
            <CardBody>
              <Stack direction="horizontal" gap={3} className="align-items-start bg-primary-subtle p-3 rounded-top m-n3">
                <IconCoins size={48} className="text-primary" />
                <Stack direction="vertical">
                  <CardTitle>Purchase Coins</CardTitle>
                  <CardSubtitle>
                    Amount of coins to purchase.
                  </CardSubtitle>
                  <Form noValidate id="validateForm" className="needs-validation mt-3">
                    <FormGroup className="mb-3" controlId="amount">
                      <FormControl
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAmount(/^[1-9]\d*$/.test(value) ? value : "");
                        }}
                        pattern="^[1-9]\d*$"
                        placeholder="Enter amount"
                        className="mb-2"
                        required
                        size="lg"
                      />
                      {error && (
                        <FormControl.Feedback type="invalid">
                          <IconAlertCircle className="me-2" /> {error}
                        </FormControl.Feedback>
                      )}
                      <FormText className={error ? "d-none" : ""}>
                        <IconInfoCircle className="me-2" />
                        There might be restrictions on the minimum and maximum from the payment API.
                      </FormText>
                    </FormGroup>
                  </Form>
                </Stack>
              </Stack>
              <h6 className="mt-5">Coins Explained</h6>
              <p>
                Coins are used to purchase data from the website. You can acquire coins by:
              </p>
              <ul>
                <li><strong>Free Coins:</strong> Earned through first-time registration.</li>
                <li><strong>Purchase Coins:</strong> Available for purchase.</li>
              </ul>
              <h6>Refund Policy</h6>
              <p>
                Purchases are non-refundable. If an error occurs, contact support immediately.
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <CardTitle>Summary</CardTitle>
              <Stack direction="horizontal" className="align-items-start">
                <div className="me-3">
                  <IconCoins size={30} />
                </div>
                <Stack direction="vertical">
                  <h5 className="mb-0">{amount || 0}</h5>
                  <p>Coins</p>
                </Stack>
              </Stack>
              <Stack direction="horizontal" className="align-items-start">
                <div className="me-3">
                  <IconCoin size={30} />
                </div>
                <Stack direction="vertical">
                  <h5 className="mb-0">{(Number(amount || 0) * cost).toFixed(2)}</h5>
                  <p>Price</p>
                </Stack>
              </Stack>
              <FormCheck
                type="checkbox"
                label={<span>I agree to the <a href="#">terms and conditions</a></span>}
                required
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={handlePurchase}
                disabled={!isTermsAccepted || loading || !isFormValid}
              >
                {loading ? "Processing..." : "Purchase"}
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
