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

function Payments() {
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Purchase Coins</h5>
              <form noValidate id="validateForm" className="needs-validation">
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmount(Number(value) ? value : "");
                    }}
                    className="form-control"
                    pattern="^([1-9][0-9]|[1-9][0-9]{2}|1000)$"
                    placeholder="Enter amount"
                    required
                  />
                  <small className="invalid-feedback">
                    <IconAlertCircle className="me-2" size={20} />
                    Please enter a valid amount.
                  </small>
                  <div className="form-text">
                    The minimum amount you can purchase is between 10 and 1000.
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col col-auto">
                  <IconCoins size={40} />
                </div>
                <div className="col">
                  <h5 className="card-title">Coins explained</h5>
                  <p className="card-text">
                    Coins are the currency used to purchase data from the
                    website. You can purchase coins in the following ways:
                  </p>
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
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col col-auto">
                  <IconInfoCircle size={40} />
                </div>
                <div className="col">
                  <h5 className="card-title">Cancellation and Refund Policy</h5>
                  <p className="card-text">
                    Once you have purchased coins, you cannot cancel the
                    purchase or request a refund. Please be sure to purchase
                    coins after confirming the amount.
                  </p>
                  <p className="card-text">
                    If you have purchased coins by mistake, please contact us
                    immediately. We will refund the coins you purchased.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Summary</h5>
              <div className="d-flex my-2">
                <div className="me-auto">Coins</div>
                <div className="d-flex align-items-center gap-1">
                  {amount} <IconCoins size={20} />
                </div>
              </div>
              <div className="d-flex my-2">
                <div className="me-auto">USD</div>
                <div className="d-flex align-items-center gap-1">
                  {Number(amount || 0) / 10} <IconCoin size={20} />
                </div>
              </div>
              <div className="d-flex my-2">
                <div className="me-auto">Discount</div>
                <div>15%</div>
              </div>
              <div className="d-flex my-2">
                <div className="me-auto">Tax</div>
                <div>0%</div>
              </div>
              <hr />
              <div className="d-flex my-2">
                <strong className="me-auto">Total</strong>
                <div>500</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" target="_blank">
                    terms and conditions
                  </a>
                </label>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handlePurchase}
                disabled={!isTermsAccepted || loading || !isFormValid}
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
