import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import customer from "../../features/customer";
import { loadCustomer, loadCustomerPayments, loadCustomerSubscriptions } from "../../features/customer/action";
import masterCard from "../../imags/mastercard.png";
import visa from "../../imags/visa.png";
import "../../style/subscription.css";

function SubscriptionView() {
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

  return (
    <div className="subscription subscription--padding-top">
      <div className="container">
        <div className="row">
          <div className="col">
            <header className="subscription__header text-start mt-5">
              <h3 className="subscription__title">Your active plan</h3>
            </header>
            {
              subscriptions.map((subscription, index) => (
                subscription.items.map((item: any, item_index: number) => (
                  <div key={index} className="card subscription__active">
                    <div className="card-body subscription__price">
                      <div className="subscription__price-title">
                        <h1>
                          {plans[item.plan.amount]['name']}
                        </h1>
                        <h1>
                          ${item.plan.amount / 100} 
                          <span>
                            /{item.plan.interval}
                          </span>
                        </h1>
                      </div>
                      <ul className="subscription__features">
                        {plans[item.plan.amount]['features'].map((feature: any, feature_index: number) => (
                          <li key={feature_index} className="subscription__feature-item">
                            <span className="subscription__feature-icon">
                              <i className="bi bi-check text-white"></i>
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="subscription__term">
                        <h4>
                          Started: 
                          <span>
                            {
                              new Date(subscription.current_period_start.seconds * 1000).toLocaleDateString()
                            }
                          </span>
                        </h4>
                        <h4>
                          Ends:
                          <span>
                            {
                              new Date(subscription.current_period_end.seconds * 1000).toLocaleDateString()
                            }
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                ))
              ))
            }
          </div>
          <div className="col-12">
            <header className="subscription__header text-start mt-5">
              <h3 className="subscription__title">History of plans</h3>
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

export default SubscriptionView
