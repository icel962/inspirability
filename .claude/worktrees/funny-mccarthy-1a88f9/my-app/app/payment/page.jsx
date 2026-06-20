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
  const [plan, setPlan] = useState("Custom Plan");
  const [duration, setDuration] = useState("Once");

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
      const planParam = params.get("plan");
      const durationParam = params.get("duration");

      if (amountParam && !isNaN(Number(amountParam))) setAmount(Number(amountParam));
      if (planParam) setPlan(planParam);
      if (durationParam) setDuration(durationParam);
    }
  }, []);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(value);
  };

  // Format Expiry (adds / automatically)
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
    // Simulate backend processing
    setTimeout(() => {
        alert("✅ Payment Successful!");
        setLoading(false);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <section className="payment-container">
        <h2 className="payment-title">Checkout</h2>

        {/* PAYMENT METHOD SELECTION */}
        <div className="payment-method-tabs">
          <div className={`method-tab ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>
            <span className="tab-icon">💳</span> Card
          </div>
          
          <div className={`method-tab ${method === "paypal" ? "active" : ""}`} onClick={() => setMethod("paypal")}>
            <NextImage src="/images/paypal.png" alt="PayPal" width={25} height={25} />
            PayPal
          </div>

          <div className={`method-tab ${method === "apple" ? "active" : ""}`} onClick={() => setMethod("apple")}>
            <NextImage src="/images/apple-pay.png" alt="Apple Pay" width={40} height={25} />
            Apple Pay
          </div>
        </div>

        {method === "card" && (
          <>
            {/* BRAND SELECTOR */}
            <div className="brand-selector">
                <button className={`brand-btn ${selectedCard === "visa" ? "active" : ""}`} onClick={() => setSelectedCard("visa")}>
                  <div className="dot"></div>
                  <img src="/images/visa.png" alt="Visa" className="card-logo-img" />
                </button>
                <button className={`brand-btn ${selectedCard === "mastercard" ? "active" : ""}`} onClick={() => setSelectedCard("mastercard")}>
                  <div className="dot"></div>
                  <img src="/images/mastercard.png" alt="MasterCard" className="card-logo-img" />
                </button>
            </div>

            {/* CARD PREVIEW */}
            <div className="cards">
                <div className={`credit-card ${selectedCard === "visa" ? "red" : "blue"}`}>
                  <div className="card-top">
                    <span>🏦 INSPIRABILITY BANK</span>
                    <span>CREDIT</span>
                  </div>
                  <h3 className="number">{cardNumber || "0000 0000 0000 0000"}</h3>
                  <div className="card-bottom">
                    <div><small>VALID THRU</small><p>{expiry || "MM/YY"}</p></div>
                    <div><small>CVV</small><p>{cvv || "•••"}</p></div>
                  </div>
                  <div className="card-name">{cardName || "YOUR NAME"}</div>
                  <div className="brand">{selectedCard.toUpperCase()}</div>
                </div>
            </div>

            {/* FORM AND SUMMARY */}
            <div className="payment-flex-layout">
              <div className="card-form-side">
                <div className="input-group">
                  <label>Cardholder Name</label>
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Full Name" />
                  
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={handleCardNumberChange} 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />

                  <div className="input-row">
                    <div>
                      <label>Expiry</label>
                      <input type="text" value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label>CVV</label>
                      <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>

                <div className="checkbox-section">
                  <label><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} /> Agree to Terms</label>
                  <label><input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} /> Save card</label>
                </div>
              </div>

              <div className="order-summary-side">
                <div className="summary-box">
                  <h3>Order Summary</h3>
                  <div className="item"><span>Plan:</span> <strong>{plan}</strong></div>
                  <div className="item"><span>Duration:</span> <strong>{duration}</strong></div>
                  <hr />
                  <div className="total"><span>Total:</span> <strong>${amount}</strong></div>
                  <button className="pay-btn" onClick={handlePay} disabled={loading}>
                    {loading ? "Processing..." : `PAY $${amount} NOW`}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PAYPAL / APPLE PAY VIEW */}
        {(method === "paypal" || method === "apple") && (
          <div className="alt-method-view">
             <div className="method-hero-icon">
                <NextImage 
                    src={`/images/${method === 'paypal' ? 'paypal.png' : 'apple-pay.png'}`} 
                    alt={method} 
                    width={150} 
                    height={80} 
                    style={{ objectFit: 'contain' }}
                />
             </div>
            <h3 className="method-title">Pay with {method === "paypal" ? "PayPal" : "Apple Pay"}</h3>
            <p className="method-title">You will be redirected to complete your <strong>${amount}</strong> payment.</p>
            <button className="pay-btn large" onClick={handlePay} disabled={loading}>
                {loading ? "Connecting..." : `Continue to ${method}`}
            </button>
          </div>
        )}
      </section>
    </>
  );
}