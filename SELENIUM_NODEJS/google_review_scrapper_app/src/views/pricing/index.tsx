import React, { useState } from "react"
import "../../style/pricing_view.css"
import { Accordion } from "react-bootstrap"

const plansItems = {
  basic: [
    "Employee Onboarding",
    "Time and Attendance Tracking",
    "Basic Payroll Processing",
    "Employee Self-Service Portal",
    "Standard Reporting",
    "Email Support",
    "50 Employee Profiles",
    "Mobile App Access",
  ],
  enterprise: [
    "All Professional Plan Features Plus",
    "Unlimited Employee Profiles",
    "Dedicated Account Manager",
    "Onboarding and Training Support",
    "Custom Workflows and Approvals",
    "API Access for Custom Integration",
    "Multi-Language and Multi-Currency Support",
    "Advanced Compliance Management",
  ],
}

const PricingView: React.FC = () => {
  const [isBasicPlan, setIsBasicPlan] = useState(true)

  const renderPlanCard = (plan: "basic" | "enterprise") => (
    <div className={`col pricing__plans-item`}>
      <div
        className={`pricing__card ${plan === "enterprise" ? "pricing__card--enterprise" : ""}`}
      >
        <h2
          className={`pricing__card-title ${plan === "enterprise" && "enterprise"}`}
        >
          {plan === "basic" ? "Basic Plan" : "Enterprise Plan"}
        </h2>
        <h1
          className={`pricing__card-price ${plan === "enterprise" && "enterprise"}`}
        >
          ${plan === "basic" ? "29" : "99"}
          <span>/month</span>
        </h1>
        <span
          className={`pricing__card-description ${plan === "enterprise" && "enterprise"}`}
        >
          {plan === "basic"
            ? "Perfect for small businesses."
            : "Ideal for larger organizations."}
        </span>
        <button
          className={`btn pricing__button ${plan == "enterprise" && "pricing__button-secondary"}`}
          onClick={() => setIsBasicPlan(plan === "basic")}
        >
          {plan == "basic" ? "Book a Demo" : "Get started with Enterprise"}
        </button>
        <ul className="pricing__list">
          {(plan === "basic" ? plansItems.basic : plansItems.enterprise).map(
            (item, index) => (
              <li
                key={index}
                className={`pricing__list-item ${plan === "enterprise" && "enterprise"}`}
              >
                <span className="pricing__list-item-icon d-flex justify-content-center align-items-center">
                  <i className="bi bi-check text-white d-flex justify-content-center align-items-center"></i>
                </span>
                {item}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="container">
      <header className="pricing__header text-center my-5">
        <h3 className="pricing__title">Plans that fit your Business</h3>
        <span className="pricing__subtitle">
          From startup to Enterprises: Plan your trip and enjoy
        </span>
      </header>
      <div className="row gap-3 pricing__plans">
        {renderPlanCard("basic")}
        {renderPlanCard("enterprise")}
      </div>
      <div className="pricing__trusted-us">
        <span>More than 100+ companies trusted us.</span>
        <div className="pricing__trusted-us__items mt-4">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="pricing__trusted-us__item" />
          ))}
        </div>
      </div>
      <div className="my-5 d-flex flex-column gap-4 text-center">
        <h3 className="pricing__title mb-3">Frequently Asked Questions</h3>
        {[
          "What payroll features are included?",
          "What are the system requirements?",
          "Can I customize the onboarding process?",
          "Is there a free trial available?",
          "Is employee data secure?",
          "How does billing work?",
        ].map((title, index) => (
          <PricingFAQ
            key={index}
            title={title}
            subtitle="Our payroll processing module includes automated payroll calculations."
          />
        ))}
      </div>
      <footer className="pricing__footer mt-5 p-5"></footer>
    </div>
  )
}

interface PricingFAQProps {
  title: string
  subtitle: string
}

const PricingFAQ: React.FC<PricingFAQProps> = ({ title, subtitle }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="row pricing__faq">
      <div
        className="card p-4"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        <div className="pricing__faq-header d-flex justify-content-between align-items-center">
          <h3 className={isOpen ? "open" : ""}>{title}</h3>
          <span className={`icon ${isOpen ? "minus" : "plus"}`}>
            {isOpen ? "-" : "+"}
          </span>
        </div>
        <div className={`pricing__faq-body ${isOpen ? "open" : ""}`}>
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

export default PricingView
