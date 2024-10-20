import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadCustomer, loadCustomerPayments, loadCustomerSubscriptions } from "../../../features/customer/action";
import "../../../style/subscription.css";

function PaymentsSubscriptionView() {
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
                          <span className="badge bg-success">
                            {subscription.status}
                          </span>
                        </h1>
                        <h1>
                          ${item.plan.amount / 100} 
                          <span>
                            /{item.plan.interval}
                          </span>
                        </h1>
                      </div>
                      {
                        subscription.status === 'active' && 
                        subscription.current_period_end &&
                        <span className="badge bg-dark text-light">
                          Next payment: {new Date(subscription.current_period_end.seconds * 1000).toLocaleDateString()}
                        </span>
                      }
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
                    <div className="card-footer">
                      <button className="btn btn-danger" onClick={() => cancelSubscription(subscription.id)} disabled={subscription.status !== 'active'}>
                        Cancel subscription
                      </button>
                      <small>
                        Canceled at: {subscription.canceled_at ? new Date(subscription.canceled_at.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </small>
                    </div>
                  </div>
                ))
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsSubscriptionView
