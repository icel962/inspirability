"use client";
import "./admin.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);
import { useEffect } from "react";


export default function Dashboard() {

  useEffect(() => {
    drawChart();
  }, []);

  return (
    <main className="dashboard-page">

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="admin-shell">

          <div className="hero-copy">
            <span className="eyebrow">Admin Panel</span>
            <h1>Admin Dashboard</h1>
            <p>
              Track monthly platform activity, monitor new parent engagement, and manage trusted contacts.
            </p>
          </div>

          <div className="stats-grid">
            {["Total Visitors","Total Registered Users","Total Contact Listings","New This Month"].map((t,i)=>(
              <div className="stat-card" key={i}>
                <p className="stat-card__label">{t}</p>
                <h2 className="stat-card__value">{["11,130","611","3","221"][i]}</h2>
                <p className="stat-card__meta">Sample data</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INSIGHTS */}
      <section className="dashboard-section">
        <div className="admin-shell">

          <div className="section-heading">
            <span className="section-kicker">Insights</span>
            <h2>Website analytics overview</h2>
            <p>Monthly sample data is ready for backend or database connection later.</p>
          </div>

          <div className="insights-layout">

            {/* CHART */}
            <div className="panel">
             <div className="panel-head">
  <div>
    <h3>Monthly performance</h3>
    <p className="sub-text">
      Visitors, signups, and inquiries across recent months.
    </p>
  </div>

  <div className="legend">
    <span><i className="dot visitors"></i>Visitors</span>
    <span><i className="dot signups"></i>Signups</span>
    <span><i className="dot inquiries"></i>Inquiries</span>
  </div>
</div>
              <div className="chart-wrap">
  <Line
    data={{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Visitors",
          data: [1240, 1400, 1650, 1850, 2150, 2400],
          borderColor: "#16227e",
          tension: 0.4
        },
        {
          label: "Signups",
          data: [700, 820, 1000, 1200, 1400, 1600],
          borderColor: "#00a6c8",
          tension: 0.4
        },
        {
          label: "Inquiries",
          data: [620, 700, 950, 1050, 1300, 1450],
          borderColor: "#8b5cf6",
          tension: 0.4
        }
      ]
    }}
    options={{
      responsive: true,
  maintainAspectRatio: false, // 🔥 أهم سطر
  plugins: {
    legend: {
      display: false // إحنا عاملين legend بإيدنا فوق
    }
      },
      scales: {
        y: {
          grid: {
            color: "#e5e7eb"
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }}
  />
</div>
            </div>

            {/* RIGHT SIDE */}
            <div className="insights-support">

  {/* Growth snapshot */}
  <div className="panel">
    <h3>Growth snapshot</h3>

    <div className="trend-item">
      <strong>Visitor growth</strong>
      <p>2,480 visitors in Jun</p>
      <span className="trend-pill is-up">+9% from last month</span>
    </div>

    <div className="trend-item">
      <strong>Signup growth</strong>
      <p>139 new users in Jun</p>
      <span className="trend-pill is-up">+11% from last month</span>
    </div>

    <div className="trend-item">
      <strong>Inquiry growth</strong>
      <p>82 parent inquiries this month</p>
      <span className="trend-pill is-up">+11% from last month</span>
    </div>
  </div>

  {/* Recent activity */}
  <div className="panel">
    <div className="panel-head">
      <div>
        <h3>Recent activity</h3>
        <p className="sub-text">
          Latest admin updates and listings added to the dashboard.
        </p>
      </div>
    </div>

    <div className="activity-list">

      <div className="activity-item">
        <strong>Analytics synced</strong>
        <p>Latest dashboard sample data prepared for Jun.</p>
        <span className="date">Moments ago</span>
      </div>

      <div className="activity-item">
        <strong>Private Doctor added</strong>
        <p>Dr. Laila Nabil in Heliopolis is ready for parent access later.</p>
        <span className="date">09 Apr 2026</span>
      </div>

      <div className="activity-item">
        <strong>Private Trainer added</strong>
        <p>Omar Hany in Maadi is ready for parent access later.</p>
        <span className="date">06 Apr 2026</span>
      </div>

      <div className="activity-item">
        <strong>Private Teacher added</strong>
        <p>Mariam Adel in Nasr City is ready for parent access later.</p>
        <span className="date">03 Apr 2026</span>
      </div>

    </div>
  </div>

</div>
          </div>

        </div>
      </section>

      {/* CONTACTS SECTION 🔥 */}
      <section className="dashboard-section dashboard-section--light">
  <div className="admin-shell">

    <div className="section-heading">
      <span className="section-kicker">CONTACTS</span>
      <h2>Manage parent resources</h2>
      <p>
        Add and maintain private teachers, trainers, and doctors in one place.
      </p>
    </div>

    <div className="management-layout">

      {/* LEFT - FORM */}
      <div className="panel form-panel">
        <h3>Add new contact</h3>
        <p className="sub-text">
          New entries are saved locally and prepared for future parent-facing use.
        </p>

        <div className="form-grid">

          <input placeholder="Full Name" />
          <select><option>Select category</option></select>

          <input placeholder="Speech therapy, math" />
          <input placeholder="0100 000 0000" />

          <input placeholder="name@example.com" />
          <input placeholder="Cairo, Giza, Nasr City..." />

          <input placeholder="Ages 4-12, home visit..." />
          <select><option>Select status</option></select>

          <input placeholder="450 EGP / session" />
          <input placeholder="4.8" />

          <input className="full" placeholder="https://example.com/profile.jpg" />

          <textarea className="full" placeholder="Short summary for parents viewing this contact later."></textarea>

        </div>

        <button className="btn-primary">Add Contact</button>
      </div>

      {/* RIGHT - TABLE */}
      <div className="panel list-panel">

        <h3>Existing contacts</h3>
        <p className="sub-text">
          Search, filter, edit, or remove listings before parents browse them.
        </p>

        <div className="filters-row">
          <input placeholder="Search by name..." />
          <select><option>All categories</option></select>
          <select><option>All statuses</option></select>
          <select><option>All cities</option></select>
        </div>

        <div className="table-wrap">
  <table className="contact-table">

    <thead>
      <tr>
        <th>NAME</th>
        <th>CATEGORY</th>
        <th>SPECIALTY</th>
        <th>CONTACT</th>
        <th>AREA</th>
        <th>STATUS</th>
        <th>ACTIONS</th>
      </tr>
    </thead>

    <tbody>

      <tr>
        <td>
          <div className="contact-title">
            <img src="/avatar.png" className="contact-avatar" />
            <div>
              <strong>Mariam Adel</strong>
              <div className="sub">4.8 / 5 rating</div>
            </div>
          </div>
        </td>

        <td>Private Teacher</td>

        <td>
          <strong>Special education and literacy support</strong>
          <div className="sub">Ages 5-11</div>
        </td>

        <td>
          <div>01012233445</div>
          <div className="sub">mariam.adel@inspirability.com</div>
        </td>

        <td>Nasr City</td>

        <td>
          <span className="status available">Available</span>
        </td>

        <td className="actions-cell">
          <button className="btn edit">Edit</button>
          <button className="btn delete">Delete</button>
        </td>
      </tr>

      <tr>
        <td>
          <div className="contact-title">
            <img src="/avatar.png" className="contact-avatar" />
            <div>
              <strong>Omar Hany</strong>
              <div className="sub">4.6 / 5 rating</div>
            </div>
          </div>
        </td>

        <td>Private Trainer</td>

        <td>
          <strong>Motor skills and adaptive fitness</strong>
          <div className="sub">Ages 6-15</div>
        </td>

        <td>
          <div>01017778899</div>
          <div className="sub">omar.hany@inspirability.com</div>
        </td>

        <td>Maadi</td>

        <td>
          <span className="status busy">Busy</span>
        </td>

        <td className="actions-cell">
          <button className="btn edit">Edit</button>
          <button className="btn delete">Delete</button>
        </td>
      </tr>

    </tbody>
  </table>
</div>

      </div>

    </div>
  </div>
</section>

    </main>
  );
  function drawChart() {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = 600;
  canvas.height = 300;

  ctx.strokeStyle = "#16227e";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(20, 200);
  ctx.lineTo(100, 180);
  ctx.lineTo(180, 150);
  ctx.lineTo(260, 120);
  ctx.lineTo(340, 100);
  ctx.lineTo(420, 80);
  ctx.stroke();
}
}