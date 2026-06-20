"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NextImage from "next/image"; 
import "./payment.css";

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(55);
  const [plan, setPlan] = useState("Custom bag");

  // Card form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState("visa");

  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const amountParam = params.get("amount");
      if (amountParam && !isNaN(Number(amountParam))) setAmount(Number(amountParam));
    }
  }, []);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setExpiry(value);
  };

  const handlePay = async () => {
    if (!token) return alert("⚠️ Please login to complete payment!");
    if (method === 'card' && !agreeTerms) return alert("Please agree to the terms.");
    
    setLoading(true);
    setTimeout(() => {
        alert("✅ Payment Successful!");
        setLoading(false);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <section className="payment-page-wrapper">
        <h2 className="section-header">Select your card</h2>

        {/* TOP TABS */}
        <div className="method-selector">
          <button className={`tab-btn ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>💳 Card</button>
          <button className={`tab-btn ${method === "paypal" ? "active" : ""}`} onClick={() => setMethod("paypal")}>PayPal</button>
          <button className={`tab-btn ${method === "apple" ? "active" : ""}`} onClick={() => setMethod("apple")}>Apple Pay</button>
        </div>

        {method === "card" && (
          <>
            {/* SIDE-BY-SIDE CARDS */}
            <div className="cards-display-row">
                <div 
                  className={`ui-credit-card card-red ${selectedCard === "visa" ? "focused" : ""}`} 
                  onClick={() => setSelectedCard("visa")}
                >
                  <div className="card-header">
                    <span>🏦 FYI BANK</span>
                    <span>CREDIT</span>
                  </div>
                  <h3 className="card-digits">{cardNumber || "0000 2363 8364 8269"}</h3>
                  <div className="card-info-grid">
                    <div><small>VALID THRU</small><p>{expiry || "5/23"}</p></div>
                    <div><small>CVV</small><p>{cvv || "633"}</p></div>
                  </div>
                  <div className="holder-name">{cardName || "Okechukwu Ozioma"}</div>
                  <div className="card-brand">VISA</div>
                </div>

                <div 
                  className={`ui-credit-card card-purple ${selectedCard === "mastercard" ? "focused" : ""}`} 
                  onClick={() => setSelectedCard("mastercard")}
                >
                  <div className="card-header">
                    <span>🏦 FYI BANK</span>
                    <span>CREDIT</span>
                  </div>
                  <h3 className="card-digits">{cardNumber || "0000 2363 8364 8269"}</h3>
                  <div className="card-info-grid">
                    <div><small>VALID THRU</small><p>{expiry || "5/23"}</p></div>
                    <div><small>CVV</small><p>{cvv || "633"}</p></div>
                  </div>
                  <div className="holder-name">{cardName || "Okechukwu Ozioma"}</div>
                  <div className="card-brand">MasterCard</div>
                </div>
            </div>

            {/* FORM AND CHECKOUT BOX */}
            <div className="main-checkout-grid">
              <div className="details-form">
                <h3>Enter card details</h3>
                <input type="text" className="styled-input" placeholder="Card name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                <input type="text" className="styled-input" placeholder="Card number" value={cardNumber} onChange={handleCardNumberChange} maxLength={19} />
                <div className="dual-inputs">
                  <input type="text" className="styled-input" placeholder="MM / YY" value={expiry} onChange={handleExpiryChange} maxLength={5} />
                  <input type="text" className="styled-input" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} />
                </div>
                <div className="checkbox-group">
                  <label><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} /> I agree to Terms</label>
                  <label><input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} /> Save card details</label>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-row"><span>Custom bag</span> <span>$50</span></div>
                <div className="summary-row"><span>Delivery charge</span> <span>$5</span></div>
                <hr className="divider" />
                <div className="summary-row total-row"><span>Total Amount</span> <span>${amount}</span></div>
                
                <button className="btn-continue">CONTINUE</button>
                <button className="btn-pay-now" onClick={handlePay} disabled={loading}>
                  {loading ? "PROCESSING..." : "PAY NOW"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}