"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import "./payment.css";
import axios from "axios";
import { showToast } from "../utils/toast";
import {
  validateCardName,
  validateCardByType,
  detectCardType,
  validateCVV,
  validateExpiry,
} from "../utils/validation";

export default function PaymentPage() {
  const [method,       setMethod]       = useState("card");
  const [loading,      setLoading]      = useState(false);
  const [token,        setToken]        = useState("");
  const [amount,       setAmount]       = useState(55);
  const [plan,         setPlan]         = useState("Custom Plan");
  const [duration,     setDuration]     = useState("Once");
  const [errors,       setErrors]       = useState({});

  // Card form state
  const [cardName,     setCardName]     = useState("");
  const [cardNumber,   setCardNumber]   = useState("");
  const [expiry,       setExpiry]       = useState("");
  const [cvv,          setCvv]          = useState("");
  const [agreeTerms,   setAgreeTerms]   = useState(false);
  const [saveCard,     setSaveCard]     = useState(false);
  const [selectedCard, setSelectedCard] = useState("visa");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const amountParam   = params.get("amount");
      const planParam     = params.get("plan");
      const durationParam = params.get("duration");
      if (amountParam && !isNaN(Number(amountParam))) setAmount(Number(amountParam));
      if (planParam)     setPlan(planParam);
      if (durationParam) setDuration(durationParam);
    }
  }, []);

  // ── Card field formatters ─────────────────────────────────────────────────

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(value);
    if (errors.cardNumber) setErrors((p) => ({ ...p, cardNumber: null }));
    const detectedType = detectCardType(value);
    console.log("Detected card type:", detectedType);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.substring(0, 2) + "/" + value.substring(2, 4);
    setExpiry(value);
    if (errors.expiry) setErrors((p) => ({ ...p, expiry: null }));
  };

  // ── Blur-time validation (real-time feedback) ─────────────────────────────

  const handleBlur = (field) => {
    const validators = {
      cardName:   () => validateCardName(cardName),
      cardNumber: () => validateCardByType(cardNumber, selectedCard),
      cvv:        () => validateCVV(cvv),
      expiry:     () => validateExpiry(expiry),
    };
    const err = validators[field]?.() || null;
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handlePay = async () => {
    if (!token) return showToast("Please login to complete payment.", "warning");

    if (method === "card") {
      const detectedType = detectCardType(cardNumber);
      const validationResult = validateCardByType(cardNumber, selectedCard);
      console.log("Detected card type:", detectedType);
      console.log("Card validation result:", validationResult);

      const fieldErrors = {
        cardName:   validateCardName(cardName),
        cardNumber: validationResult,
        cvv:        validateCVV(cvv),
        expiry:     validateExpiry(expiry),
      };
      const hasErrors = Object.values(fieldErrors).some(Boolean);
      if (hasErrors) { setErrors(fieldErrors); return; }

      if (!agreeTerms) return showToast("Please agree to the terms before continuing.", "warning");
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        await axios.put(
          "http://localhost:5000/api/payment-request",
          { plan, amount, duration },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast("Payment submitted! Awaiting admin review.", "success");
      } catch (err) {
        console.error(err);
        showToast("Payment request failed. Please try again.", "error");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <section className="payment-container">
        <h2 className="payment-title">Checkout</h2>

        {/* PAYMENT METHOD TABS */}
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
              <button
                className={`brand-btn ${selectedCard === "visa" ? "active" : ""}`}
                onClick={() => setSelectedCard("visa")}
              >
                <div className="dot"></div>
                <img src="/images/visa.png" alt="Visa" className="card-logo-img" />
              </button>
              <button
                className={`brand-btn ${selectedCard === "mastercard" ? "active" : ""}`}
                onClick={() => setSelectedCard("mastercard")}
              >
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

            {/* FORM + SUMMARY */}
            <div className="payment-flex-layout">
              <div className="card-form-side">
                <div className="input-group">

                  {/* Cardholder Name */}
                  <label>
                    Cardholder Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => { setCardName(e.target.value); setErrors((p) => ({ ...p, cardName: null })); }}
                    onBlur={() => handleBlur("cardName")}
                    placeholder="Full Name"
                    className={errors.cardName ? "input-field-error" : ""}
                  />
                  {errors.cardName && <span className="field-error">{errors.cardName}</span>}

                  {/* Card Number */}
                  <label style={{ marginTop: 14 }}>
                    Card Number <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onBlur={() => handleBlur("cardNumber")}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={errors.cardNumber ? "input-field-error" : ""}
                  />
                  {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}

                  {/* Expiry + CVV */}
                  <div className="input-row" style={{ marginTop: 14 }}>
                    <div>
                      <label>
                        Expiry <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        onBlur={() => handleBlur("expiry")}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={errors.expiry ? "input-field-error" : ""}
                      />
                      {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                    </div>
                    <div>
                      <label>
                        CVV <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, cvv: null })); }}
                        onBlur={() => handleBlur("cvv")}
                        placeholder="123"
                        maxLength={4}
                        className={errors.cvv ? "input-field-error" : ""}
                      />
                      {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                    </div>
                  </div>
                </div>

                <div className="checkbox-section">
                  <label>
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                    {" "}Agree to Terms
                  </label>
                  <label>
                    <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                    {" "}Save card
                  </label>
                </div>
              </div>

              <div className="order-summary-side">
                <div className="summary-box">
                  <h3>Order Summary</h3>
                  <div className="item"><span>Plan:</span> <strong>{plan}</strong></div>
                  <div className="item"><span>Duration:</span> <strong>{duration}</strong></div>
                  <hr />
                  <div className="total"><span>Total:</span> <strong>EGP {amount}</strong></div>
                  <button className="pay-btn" onClick={handlePay} disabled={loading}>
                    {loading ? "Processing..." : `PAY EGP ${amount} NOW`}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PAYPAL / APPLE PAY */}
        {(method === "paypal" || method === "apple") && (
          <div className="alt-method-view">
            <div className="method-hero-icon">
              <NextImage
                src={`/images/${method === "paypal" ? "paypal.png" : "apple-pay.png"}`}
                alt={method}
                width={150}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3 className="method-title">Pay with {method === "paypal" ? "PayPal" : "Apple Pay"}</h3>
            <p className="method-title">
              You will be redirected to complete your <strong>EGP {amount}</strong> payment.
            </p>
            <button className="pay-btn large" onClick={handlePay} disabled={loading}>
              {loading ? "Connecting..." : `Continue to ${method}`}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
