"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./requests.css";

// ─── helpers ────────────────────────────────────────────────────────────────

function Row({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <p>
      <strong>{label}:</strong> {String(value)}
    </p>
  );
}

function yesNo(val) {
  if (val === 1 || val === true) return "Yes";
  if (val === 0 || val === false) return "No";
  return null;
}

// ─── role-specific detail blocks ────────────────────────────────────────────

function SchoolDetails({ p }) {
  return (
    <>
      <Row label="School Name"           value={p.school_name} />
      <Row label="Category"              value={p.category_of_school} />
      <Row label="Curriculum"            value={p.curriculum_type} />
      <Row label="Educational Level"     value={p.educational_level} />
      <Row label="Class Capacity"        value={p.class_capacity} />
      <Row label="Registration Fees"     value={p.registration_fees} />
      <Row label="Annual Fees"           value={p.annual_fees} />
      <Row label="Special Type"          value={p.special_type} />
      <Row label="Shadow Availability"   value={yesNo(p.shadow_availability)} />
      <Row label="Teacher Training"      value={p.teacher_training_status} />
      <Row label="Certifications"        value={yesNo(p.s_certifications)} />
      <Row label="Admission Details"     value={p.admission_details} />
      <Row label="About / History"       value={p.history_info} />
      <Row label="Social Media"          value={p.s_social_media} />
      <Row label="Phone"                 value={p.s_phone} />
      <Row label="Email"                 value={p.s_email || p.user_email} />
      <Row label="City"                  value={p.s_city} />
      <Row label="Government"            value={p.s_government} />
      <Row label="Location"              value={p.s_location} />
      {p.school_logo && (
        <p>
          <strong>Logo / Documents:</strong>{" "}
          {p.school_logo.split(",").map((f, i) => (
            <span key={i} style={{ display: "block", fontSize: "0.8rem", color: "#555" }}>
              {f.trim()}
            </span>
          ))}
        </p>
      )}
    </>
  );
}

function ClinicDetails({ p }) {
  return (
    <>
      <Row label="Clinic Name"           value={p.clinic_name} />
      <Row label="Clinic Type"           value={p.clinic_type} />
      <Row label="Specialization"        value={p.specialization_type} />
      <Row label="Specialized Therapists" value={p.specialized_therapists} />
      <Row label="Session Price Range"   value={p.session_price_range} />
      <Row label="Working Hours"         value={p.working_hours_and_days} />
      <Row label="Certifications"        value={yesNo(p.mc_certifications)} />
      <Row label="Sliding Equipment"     value={yesNo(p.sliding_equipments)} />
      <Row label="Phone"                 value={p.mc_phone} />
      <Row label="Email"                 value={p.mc_email || p.user_email} />
      <Row label="Location"              value={p.mc_location} />
    </>
  );
}

function SportDetails({ p }) {
  return (
    <>
      <Row label="Center Name"           value={p.sport_center_name} />
      <Row label="Center Type"           value={p.sport_center_type} />
      <Row label="Sports Offered"        value={p.sports_type_offered} />
      <Row label="Age Range"             value={p.sc_age} />
      <Row label="Working Hours"         value={p.working_days_and_hours} />
      <Row label="Session Price Min"     value={p.session_price_min} />
      <Row label="Session Price Max"     value={p.session_price_max} />
      <Row label="Session Type"          value={p.private_sessions_or_group === 0 ? "Private" : "Group"} />
      <Row label="Staff Qualifications"  value={p.staff_qualifications} />
      <Row label="Coach Certifications"  value={p.coach_certifications} />
      <Row label="Special Coach"         value={yesNo(p.special_coach_availability)} />
      <Row label="Adaptive Equipment"    value={yesNo(p.adaptive_equipments)} />
      <Row label="Supported Conditions"  value={p.supported_conditions} />
      <Row label="Description"           value={p.sc_details} />
      <Row label="More Info"             value={p.sc_more_info} />
      <Row label="Social Media"          value={p.sc_social_media} />
      <Row label="Phone"                 value={p.sc_phone} />
      <Row label="Email"                 value={p.sc_email || p.user_email} />
      <Row label="Location"              value={p.sc_location} />
    </>
  );
}

function ProviderDetails({ p }) {
  if (p.role === "school")  return <SchoolDetails p={p} />;
  if (p.role === "clinic")  return <ClinicDetails p={p} />;
  if (p.role === "sport")   return <SportDetails p={p} />;
  return null;
}

// helper: pick the right name/email/phone for the card heading
function providerMeta(p) {
  if (p.role === "school")  return { name: p.school_name,       email: p.s_email  || p.user_email, phone: p.s_phone };
  if (p.role === "clinic")  return { name: p.clinic_name,       email: p.mc_email || p.user_email, phone: p.mc_phone };
  if (p.role === "sport")   return { name: p.sport_center_name, email: p.sc_email || p.user_email, phone: p.sc_phone };
  return { name: p.user_email, email: p.user_email, phone: null };
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const [providerRequests,  setProviderRequests]  = useState([]);
  const [paymentRequests,   setPaymentRequests]   = useState([]);
  const [providerDecisions, setProviderDecisions] = useState({});
  const [paymentDecisions,  setPaymentDecisions]  = useState({});

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      const [providerRes, paymentRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/provider-requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/payment-requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProviderRequests(providerRes.data);
      setPaymentRequests(paymentRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      console.error(err);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // ── provider action ──────────────────────────────────────────────────────
  const handleProviderAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/${action}-provider/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviderDecisions((prev) => ({ ...prev, [id]: action }));
    } catch (err) {
      console.error(err);
    }
  };

  // ── payment action ───────────────────────────────────────────────────────
  const handlePaymentAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/${action}-payment/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentDecisions((prev) => ({ ...prev, [id]: action }));
    } catch (err) {
      console.error(err);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="requests-container">
      <h1 className="page-title">Admin Requests</h1>

      {/* ── PROVIDER REQUESTS ────────────────────────────────────────── */}
      <section>
        <h2 className="section-title">Provider Requests</h2>

        {providerRequests.length === 0 && (
          <p className="empty-msg">No pending provider requests.</p>
        )}

        <div className="requests-grid">
          {providerRequests.map((provider) => {
            const meta     = providerMeta(provider);
            const decision = providerDecisions[provider.user_id];
            return (
              <div
                key={provider.user_id}
                className={`request-card ${decision === "approve" ? "is-approved" : decision === "reject" ? "is-rejected" : ""}`}
              >
                <h3>{meta.name || meta.email}</h3>

                <p><strong>Email:</strong> {meta.email}</p>
                {meta.phone && <p><strong>Phone:</strong> {meta.phone}</p>}
                <p><strong>Role:</strong> {provider.role}</p>
                <p><strong>Approval Status:</strong> {provider.approval_status}</p>

                <hr style={{ margin: "10px 0", borderColor: "#eee" }} />

                <ProviderDetails p={provider} />

                {decision ? (
                  <div className={`decision-badge ${decision === "approve" ? "approved" : "rejected"}`}>
                    {decision === "approve" ? "✓ Approved" : "✗ Rejected"}
                  </div>
                ) : (
                  <div className="actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleProviderAction(provider.user_id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleProviderAction(provider.user_id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PAYMENT REQUESTS ─────────────────────────────────────────── */}
      <section>
        <h2 className="section-title">Payment Requests</h2>

        {paymentRequests.length === 0 && (
          <p className="empty-msg">No pending payment requests.</p>
        )}

        <div className="requests-grid">
          {paymentRequests.map((payment) => {
            const meta     = providerMeta(payment);
            const decision = paymentDecisions[payment.user_id];
            return (
              <div
                key={payment.user_id}
                className={`request-card ${decision === "approve" ? "is-approved" : decision === "reject" ? "is-rejected" : ""}`}
              >
                <h3>{meta.name || meta.email}</h3>

                <p><strong>Email:</strong> {meta.email}</p>
                {meta.phone && <p><strong>Phone:</strong> {meta.phone}</p>}
                <p><strong>Role:</strong> {payment.role}</p>
                <p><strong>Payment Status:</strong> {payment.payment_status}</p>

                <hr style={{ margin: "10px 0", borderColor: "#eee" }} />

                <p>
                  <strong>Payment Plan:</strong>{" "}
                  {payment.payment_plan || "-"}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {payment.payment_amount != null ? `$${payment.payment_amount}` : "-"}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {payment.payment_duration || "-"}
                </p>

                {decision ? (
                  <div className={`decision-badge ${decision === "approve" ? "approved" : "rejected"}`}>
                    {decision === "approve" ? "✓ Approved" : "✗ Rejected"}
                  </div>
                ) : (
                  <div className="actions">
                    <button
                      className="approve-btn"
                      onClick={() => handlePaymentAction(payment.user_id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handlePaymentAction(payment.user_id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
