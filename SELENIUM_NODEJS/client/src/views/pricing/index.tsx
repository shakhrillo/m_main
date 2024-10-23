import { doc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { loadCustomer, loadCustomerPayments, loadCustomerSubscriptions } from "../../features/customer/action"
import { buyProductAction, loadProductPrices, loadProducts } from "../../features/products/actions"
import amplitude from "../../imags/amplitude.png"
import atlassian from "../../imags/atlassian.png"
import basecamp from "../../imags/basecamp.png"
import docker from "../../imags/docker.png"
import dropbox from "../../imags/dropbox.png"
import fiverr from "../../imags/fiverr.png"
import "../../style/pricing_view.css"

const trusteCompaniesLogos = [
  docker,
  atlassian,
  basecamp,
  dropbox,
  fiverr,
  amplitude,
]

const PricingView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const db = useAppSelector((state) => state.firebase.db);
  const currentUser = useAppSelector((state) => state.auth.user);
  const products = useAppSelector((state) => state.products.products);
  const prices = useAppSelector((state) => state.products.prices);
  const purchaseId = useAppSelector((state) => state.products.purchaseId);
  const customer = useAppSelector((state) => state.customer.customer);

  useEffect(() => {
    if (!db || !currentUser) return;
    dispatch(loadProducts({ db }));
    dispatch(loadCustomer({ db, customerId: currentUser.uid }));
  }, [dispatch, db, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    dispatch(loadCustomerSubscriptions({ db, customerId: currentUser.uid }));
    dispatch(loadCustomerPayments({ db, customerId: currentUser.uid }));
  }, [customer, currentUser]);

  useEffect(() => {
    if (!purchaseId) return;
    const purchaseDoc = doc(db, "customers", currentUser.uid, "checkout_sessions", purchaseId);
    onSnapshot(purchaseDoc, (doc) => {
      const { error, url } = doc.data() || {};
      if (error) {
        setError(error);
      }
      if (url) {
        setLoading(false);
        setError("");
        window.location.assign(url);
      }
    });

  }, [purchaseId]);

  useEffect(() => {
    if (!products) return;

    products.forEach((product) => {
      dispatch(loadProductPrices({ db, productId: product.id }));
    });
  }, [products]);

  async function buyProduct(product: any, price: any) {
    dispatch(buyProductAction({ db, currentUser, price }));
    setLoading(true);
  }

  return (
    <div className="container">
      <header className="pricing__header text-center my-5">
        <h3 className="pricing__title">Plans that fit your Business</h3>
        <span className="pricing__subtitle">
          From startup to Enterprises: Plan your trip and enjoy
        </span>
      </header>
      <div className="row pricing__plans">
        {
          products.map((product, index) => (
            <div key={index} className="col pricing__plans-item">
              <div className="pricing__card">
                <h2 className="pricing__card-title">{product.name}</h2>
                <h1 className="pricing__card-price">
                  ${prices[product.id]?.unit_amount / 100}
                  <span>/{prices[product.id]?.recurring.interval}</span>
                </h1>
                <span className="pricing__card-description">{product.description}</span>
                <button className="btn btn-primary" onClick={() => buyProduct(product, prices[product.id])} disabled={loading}>
                  Get started with {product.name}
                </button>
                
                {error && <span className="text-danger">{error}</span>}

                <ul className="pricing__list">
                  {
                    [
                      'Employee Onboarding',
                      'Time and Attendance Tracking',
                      'Basic Payroll Processing',
                      'Employee Self-Service Portal',
                      'Standard Reporting'
                    ].map((item, index) => (
                      <li key={index} className="pricing__list-item">
                        <span className="pricing__list-item-icon d-flex justify-content-center align-items-center">
                          <i className="bi bi-check text-white d-flex justify-content-center align-items-center"></i>
                        </span>
                        {item}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
      </div>
      <div className="pricing__trusted-us">
        <span>More than 100+ companies trusted us.</span>
        <div className="pricing__trusted-us__items mt-4">
          {trusteCompaniesLogos.map((_, index) => (
            <img src={_} key={index} className="pricing__trusted-us__item" />
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
