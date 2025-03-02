import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormText,
  Row,
  Stack,
} from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import { filter, take } from "rxjs";
import { buyCoins, buyCoinsData } from "../services/paymentService";
import { settingValue } from "../services/settingService";
import {
  IconCoins,
  IconCoin,
  IconInfoCircle,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { IUserInfo } from "../types/userInfo";

export const Payments = () => {
  const user = useOutletContext<IUserInfo>();
  const [amount, setAmount] = useState("");
  const [coinId, setCoinId] = useState("");
  const [cost, setCost] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const subscription = settingValue({ tag: "cost", type: "coin" })
      .pipe(filter(Boolean), take(1))
      .subscribe(({ value }) => setCost(value || 1));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!coinId || !user) return;
    const unsubscribe = buyCoinsData(coinId, user.uid).subscribe(
      ({ url, error }) => {
        if (url) window.location.href = url;
        if (error) handleError(error);
      },
    );
    return () => unsubscribe.unsubscribe();
  }, [coinId, user]);

  useEffect(() => {
    const form = document.getElementById("validateForm") as HTMLFormElement;
    if (form) {
      form.classList.add("was-validated");
      setIsFormValid(form.checkValidity());
    }
  }, [amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(/^[1-9]\d*$/.test(value) ? value : "");
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const id = await buyCoins(
        user?.uid,
        Number(amount),
        Number(amount) * cost,
      );
      setCoinId(id);
    } catch {
      handleError("Purchase failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message: string) => {
    setError(message);
    resetForm();
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
              <h5 className="payments-title">Purchase Coins</h5>
              <span className="text-muted">Amount of coins to purchase.</span>
              <Form
                noValidate
                id="validateForm"
                className="needs-validation mt-2"
              >
                <FormGroup className="mb-3">
                  <FormControl
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
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
                  {!error && (
                    <FormText>
                      <IconInfoCircle className="me-2" /> There might be
                      restrictions on min/max amounts.
                    </FormText>
                  )}
                </FormGroup>
              </Form>
            </Stack>
          </Stack>

          <h6 className="mt-3">Coins Explained</h6>
          <p>
            Coins are used to purchase data from the website. You can acquire
            coins by:
          </p>
          <ul>
            <li>
              <strong>Free Coins:</strong> Earned through first-time
              registration.
            </li>
            <li>
              <strong>Purchase Coins:</strong> Available for purchase.
            </li>
          </ul>
          <h6>Refund Policy</h6>
          <p>
            Purchases are non-refundable. If an error occurs, contact support
            immediately.
          </p>
        </Col>

        <Col md={3}>
          <div className="payment-summary">
            <Stack direction="horizontal" className="align-items-start">
              <IconCoins className="me-3" />
              <Stack direction="vertical">
                <strong>{amount || 0}</strong>
                <p>Coins</p>
              </Stack>
            </Stack>
            <Stack direction="horizontal" className="align-items-start">
              <IconCoin className="me-3" />
              <Stack direction="vertical">
                <strong>{(Number(amount || 0) * cost).toFixed(2)}</strong>
                <p>Price</p>
              </Stack>
            </Stack>
            <FormCheck
              type="checkbox"
              label={
                <>
                  <NavLink to="/terms">
                    I agree to the terms and conditions
                  </NavLink>
                </>
              }
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
