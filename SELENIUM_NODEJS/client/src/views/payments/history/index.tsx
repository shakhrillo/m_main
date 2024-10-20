import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadCustomer, loadCustomerPayments, loadCustomerSubscriptions } from "../../../features/customer/action";
import "../../../style/subscription.css";

function PaymentsHistoryView() {
  const dispatch = useAppDispatch();

  const db = useAppSelector((state) => state.firebase.db);
  const currentUser = useAppSelector((state) => state.auth.user);
  const customer = useAppSelector((state) => state.customer.customer);
  const subscriptions = useAppSelector((state) => state.customer.subscriptions);
  const payments = useAppSelector((state) => state.customer.payments);

  useEffect(() => {
    console.log("subscriptions", subscriptions);
    console.log("payments", payments);
  }, [subscriptions, payments]);

  useEffect(() => {
    if (!db || !currentUser) return;
    dispatch(loadCustomer({ db, customerId: currentUser.uid }));
  }, [dispatch, db, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    dispatch(loadCustomerSubscriptions({ db, customerId: currentUser.uid }));
    dispatch(loadCustomerPayments({ db, customerId: currentUser.uid }));
  }, [customer, currentUser]);

  const plans: any = {
    "4500": {
      "name": "Basic membership (GMS)",
      "features": [
        "Employee Onboarding",
        "Time and Attendance Tracking",
        "Basic Payroll Processing",
        "Employee Self-Service Portal",
        "Standard Reporting",
      ]
    },
    "15000": {
      "name": "Premium membership (GMS)",
      "features": [
        "Employee Onboarding",
        "Time and Attendance Tracking",
        "Basic Payroll Processing",
        "Employee Self-Service Portal",
        "Standard Reporting",
        "Advanced Reporting",
        "Custom Reporting",
      ]
    },
    "700": {
      "name": "Jet membership (GMS)",
      "features": [
        "Employee Onboarding",
        "Time and Attendance Tracking",
        "Basic Payroll Processing",
        "Employee Self-Service Portal",
        "Standard Reporting",
      ]
    }
  }

  const tableHeader = [
    { icon: "", text: "#" },
    { icon: "", text: "Plan" },
    { icon: "", text: "Date" },
    { icon: "", text: "Price" },
    { icon: "", text: "Card" },
    { icon: "", text: "Status" },
  ]

  async function cancelSubscription(subscriptionId: string) {
    await fetch(`http://localhost:3000/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscriptionId })
    });
  }

  return (
    <div className="subscription subscription--padding-top">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <header className="subscription__header text-start mt-5">
              <h3 className="subscription__title">Payments history</h3>
            </header>
            <div className="card">
              <div className="card-body">
                <table className="table subscription__table">
                  <thead>
                    <tr>
                      {tableHeader.map((header, index) => (
                        <th scope="col" key={index}>
                          {header.icon && <i className={header.icon} />}{" "}
                          {header.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      payments.map((payment, index) => (
                        payment.charges.data.map((charge: any, charge_index: number) => (
                          <tr key={index + '_' + charge_index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              {
                                charge.amount === 4500
                                ? "Basic membership (GMS)" : "Premium membership (GMS)"
                              }
                            </td>
                            <td>
                              {new Date(charge.created * 1000).toLocaleDateString()}
                            </td>
                            <td>
                              {charge.amount / 100} {charge.currency}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <small>
                                  **** {charge.payment_method_details.card.last4} ({charge.payment_method_details.card.exp_month}/{charge.payment_method_details.card.exp_year})
                                </small>
                                <span className="badge bg-dark text-light">
                                  {charge.payment_method_details.card.brand === "visa" ? "VISA" : "MC"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={charge.status === 'succeeded' ? 'badge bg-success' : 'badge bg-danger'}>
                                {charge.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsHistoryView
