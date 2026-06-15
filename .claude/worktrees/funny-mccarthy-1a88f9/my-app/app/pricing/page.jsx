"use client";
import "./pricing.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const handleUpgrade = (plan, amount) => {
    const duration = isMonthly ? "Monthly" : "Yearly";
    router.push(`/payment?amount=${amount}&plan=${encodeURIComponent(plan)}&duration=${duration}`);
  };

  const litePrice = isMonthly ? 16 : 12;
  const proPrice = isMonthly ? 35 : 28;

  return (
    <>
      <Navbar />

      <section className="pricing">
        <h1>Our Pricing Plans</h1>
        <p className="subtitle">
          A subscription plan for every parent
        </p>

        {/* Toggle */}
        <div className="toggle">
          <span className={isMonthly ? "active" : ""}>Monthly</span>

          <div
            className="switch"
            onClick={() => setIsMonthly(!isMonthly)}
          >
            <div className={`circle ${isMonthly ? "" : "right"}`} />
          </div>

          <span className={!isMonthly ? "active" : ""}>Annually</span>
        </div>

        {/* Cards */}
        <div className="cards">

          {/* Starter */}
          <div className="card">
            <h3>Starter</h3>
            <h2 className="price">Free</h2>

            <p>
              Free for ever when you host with Debbi. free for freelancers with Client Billing
            </p>

            <ul>
              <li>✔ 2 Projects</li>
              <li>✔ Client Billing</li>
              <li>✔ Free Staging</li>
              <li>Code Export</li>
              <li>White labeling</li>
              <li>Site password protection</li>
            </ul>

            <button className="btn">Current plan</button>
          </div>

          {/* Lite */}
          <div className="card featured">
            <h3>
              Lite <span>(Recommended)</span>
            </h3>
            <h2 className="price">
              ${litePrice} <small>/{isMonthly ? "month" : "year"}</small>
            </h2>

            <p>
              Free for ever when you host with Debbi. free for freelancers with Client Billing
            </p>

            <ul>
              <li>✔ 2 Projects</li>
              <li>✔ Client Billing</li>
              <li>✔ Free Staging</li>
              <li>✔ Code Export</li>
              <li>White labeling</li>
              <li>Site password protection</li>
            </ul>

            <button className="btn primary" onClick={() => handleUpgrade("Lite", litePrice)}>
              Upgrade plan
            </button>
          </div>

          {/* Pro */}
          <div className="card">
            <h3>Pro</h3>
            <h2 className="price">
              ${proPrice} <small>/{isMonthly ? "month" : "year"}</small>
            </h2>

            <p>
              Free for ever when you host with Debbi. free for freelancers with Client Billing
            </p>

            <ul>
              <li>✔ 2 Projects</li>
              <li>✔ Client Billing</li>
              <li>✔ Free Staging</li>
              <li>✔ Code Export</li>
              <li>✔ White labeling</li>
              <li>✔ Site password protection</li>
            </ul>

            <button className="btn" onClick={() => handleUpgrade("Pro", proPrice)}>
              Upgrade plan
            </button>
          </div>
        </div>
      </section>

     
    </>
  );
}