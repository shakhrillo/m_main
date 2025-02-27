import { IconAlertCircle, IconCoin, IconCoins, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Container, Form, FormCheck, FormControl, FormGroup, FormText, Row, Stack } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { filter, take } from "rxjs";
import { buyCoins, buyCoinsData } from "../services/paymentService";
import { settingValue } from "../services/settingService";
import { IUserInfo } from "../types/userInfo";

/**
 * View for purchasing coins.
 * @returns Component.
 */
export const Payments = () => {
  const user = useOutletContext<IUserInfo>();
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
    if (!coinId || !user) return;

    const unsubscribe = buyCoinsData(coinId, user?.uid).subscribe((data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        setError(data.error);
        resetForm();
      }
    });

    return () => unsubscribe.unsubscribe();
  }, [coinId, user]);

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
      const id = await buyCoins(user?.uid, Number(amount), Number(amount) * cost);
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
      <Row>
        <Col md={9}>
          <Stack direction="horizontal" gap={3} className="payments">
            <IconCoins size={48} className="text-primary" />
            <Stack direction="vertical">
              <div className="payments-title">
                Purchase Coins
              </div>
              <span className="text-muted">
                Amount of coins to purchase.
              </span>
              <Form noValidate id="validateForm" className="needs-validation mt-2">
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

          <h6 className="mt-3">Coins Explained</h6>
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
        </Col>
        <Col md={3}>
          <div className="payment-summary">
            <Stack direction="horizontal" className="align-items-start">
              <div className="me-3">
                <IconCoins />
              </div>
              <Stack direction="vertical">
                <h6 className="mb-0">{amount || 0}</h6>
                <p>Coins</p>
              </Stack>
            </Stack>
            <Stack direction="horizontal" className="align-items-start">
              <div className="me-3">
                <IconCoin />
              </div>
              <Stack direction="vertical">
                <h6 className="mb-0">{(Number(amount || 0) * cost).toFixed(2)}</h6>
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
          </div>
        </Col>
      </Row>
    </Container>
  );
};
