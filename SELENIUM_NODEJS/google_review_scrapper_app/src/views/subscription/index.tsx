import React from "react"
import visa from "../../imags/visa.png"
import masterCard from "../../imags/mastercard.png"
import "../../style/subscription.css"

const Subscription: React.FC = () => {
  const userPaymentCards = [
    { name: "Visa", lastFourCode: "4434" },
    { name: "MasterCard", lastFourCode: "6612" },
  ]

  const planFeatures = [
    "Employee Onboarding",
    "Time and Attendance Tracking",
    "Basic Payroll Processing",
    "Employee Self-Service Portal",
    "Standard Reporting",
  ]

  const tableHeader = [
    { icon: "", text: "#" },
    { icon: "", text: "Plan" },
    { icon: "", text: "Date" },
    { icon: "", text: "Price" },
    { icon: "", text: "Card" },
  ]

  return (
    <div className="subscription subscription--padding-top">
      <div className="container">
        <div className="row">
          {/* Active Plan Section */}
          <div className="col-1"></div>
          <div className="col-5">
            <header className="subscription__header text-start mt-5">
              <h3 className="subscription__title">Your active plan</h3>
            </header>
            <div className="card subscription__active">
              <div className="card-body subscription__price">
                <div className="subscription__price-title">
                  <h1>Basic membership (GMS)</h1>
                  <h1>
                    $45 <span>/month</span>
                  </h1>
                </div>
                <ul className="subscription__features">
                  {planFeatures.map((item, index) => (
                    <li key={index} className="subscription__feature-item">
                      <span className="subscription__feature-icon">
                        <i className="bi bi-check text-white"></i>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="subscription__term">
                  <h4>
                    Started: <span>18/12/2024</span>
                  </h4>
                  <h4>
                    Ends: <span>18/01/2025</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="col-5">
            <header className="subscription__header text-start mt-5">
              <h3 className="subscription__title">Payment</h3>
            </header>
            <div className="subscription__payment-options">
              {userPaymentCards.map((card, index) => (
                <div key={index} className="card subscription__payment-card">
                  <div className="card-body">
                    <div className="subscription__card-info">
                      <div className="d-flex gap-3">
                        <input type="radio" name="payment-option" checked />
                        <div>
                          <h4>**** {card.lastFourCode}</h4>
                          <div className="subscription__card-actions">
                            <span>{card.name}</span>
                            <a href="#">Edit</a>
                          </div>
                        </div>
                      </div>
                      <img
                        src={card.name === "Visa" ? visa : masterCard}
                        alt={card.name}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr />
            <div className="card subscription__add-card">
              <div className="card-body">
                <a href="#">+ Add new</a>
              </div>
            </div>
          </div>
        </div>

        {/* Plan History Section */}
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
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
                    <tr>
                      <th scope="row">1</th>
                      <td>Basic membership (GMS)</td>
                      <td>18/12/2024 - 18/01/2025</td>
                      <td>$45</td>
                      <td>*** 6612</td>
                    </tr>
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

export default Subscription
