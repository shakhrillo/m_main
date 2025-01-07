import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebase } from "../contexts/FirebaseProvider";
import { buyCoins, getPaymentsQuery } from "../services/firebaseService";
import { formatTimestamp } from "../utils/formatTimestamp";
import cardIcon from "../assets/icons/credit-card.svg";
import emptyIcon from "../assets/icons/empty-folder.png";
import { Table } from "../components/table";

function Payments() {
  const { firestore, user } = useFirebase();

  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([] as any[]);
  const [minAmount, setMinAmount] = useState("100");
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("usd");
  const [totalPrice, setTotalPrice] = useState("0");
  const [userInformation, setUserInformation] = useState({} as any);
  const [coinId, setCoinId] = useState("");

  useEffect(() => {
    if (!user || !firestore) return;

    const unsubscribe = onSnapshot(getPaymentsQuery(user.uid), (snapshot) => {
      const historyData = snapshot.docs.map((doc) => doc.data());
      console.log(historyData);
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, [firestore, user]);

  useEffect(() => {
    if (!firestore || !user) return;
    const userDoc = doc(firestore, `users/${user.uid}`);

    const unsubscribe = onSnapshot(userDoc, (doc) => {
      setUserInformation(doc.data());
    });

    return () => {
      unsubscribe();
    };
  }, [firestore, user]);

  useEffect(() => {
    if (!coinId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user?.uid}/buyCoins`, coinId),
      (doc) => {
        const data = doc.data();
        const url = data?.url;
        if (url) {
          window.open(url, "_blank");
        }
      },
    );

    return () => unsubscribe();
  }, [coinId]);

  useEffect(() => {
    if (!firestore) return;
    const settingsRef = doc(firestore, `app/settings`);
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const costs = Number(data.costs);
        const currency = data.currency;
        const minimumCount = 99;

        const minimumCost = 0.5;
        if (["usd", "eur", "cad"].includes(currency)) {
          const amount = Math.max(minimumCount, Math.ceil(minimumCost / costs));
          setAmount(amount.toString());
          setTotalPrice((amount * costs).toFixed(2));
        }
        setCurrency(currency);
        setMinAmount(minimumCount.toString());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firestore]);

  // DateIDPayment MethodAmountStatusReceiptInvoice
  const tableColumns = [
    {
      text: "Date",
      field: "date",
      render: (row: any) => <span>{formatTimestamp(row.created).date}</span>,
    },
    {
      text: "ID",
      field: "id",
      render: (row: any) => <span>{row.charge?.payment_intent}</span>,
    },
    {
      text: "Payment Method",
      field: "paymentMethod",
      render: (row: any) => (
        <span>
          {`${row.charge?.payment_method_details?.card?.brand} ending in ${row.charge?.payment_method_details?.card?.last4}`}
        </span>
      ),
    },
    {
      text: "Amount",
      field: "amount",
      render: (row: any) => (
        <span>
          {row.charge?.amount / 100} {currency}
        </span>
      ),
    },
    {
      text: "Status",
      field: "status",
      render: (row: any) => <span>{row.charge?.status}</span>,
    },
    {
      text: "Receipt",
      field: "receipt",
      render: (row: any) => (
        <a href={row.charge?.receipt_url} target="_blank" rel="noreferrer">
          <img src={cardIcon} alt="Receipt" width={16} className="me-1" />
          Receipt
        </a>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          <div className="card">
            <div className="card-body">
              <Table tableHeader={tableColumns} tableBody={history}></Table>
              {history.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                  <img src={emptyIcon} alt="Empty folder" width={64} />
                  <h6 className="text-muted mt-2">
                    No transactions found in your history.
                  </h6>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <h5 className="m-0">Balance</h5>
                <button className="btn alert alert-primary py-1 button-success mb-0">
                  {(userInformation?.coinBalance || 0)
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                  coins
                </button>
              </div>
              <form>
                <div className="mt-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmount(value);
                    }}
                    className="form-select"
                    min={minAmount}
                  />
                  <div className="form-text" id="urlHelp">
                    Min: {minAmount} coins, Total: {totalPrice} {currency}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    const coindId =
                      (await buyCoins(user!.uid, Number(amount) * 100)) || "";
                    setCoinId(coindId);
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="btn btn-primary mt-3"
                >
                  Buy {amount} coins ({totalPrice} {currency})
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
