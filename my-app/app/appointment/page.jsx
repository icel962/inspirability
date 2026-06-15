"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { saveExtraData } from "../utils/appointmentExtraStorage";
import { showToast } from "../utils/toast";
import { validateAppointmentDate, validateAppointmentTime } from "../utils/validation";
import "./appointment.css";

// ─── Time slots: 8:00 AM → 10:00 PM in 30-min intervals ───────────────────

const TIME_SLOTS = Array.from({ length: 29 }, (_, i) => {
  const total = 8 * 60 + i * 30;
  const h  = Math.floor(total / 60);
  const m  = total % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ampm = h < 12 ? "AM" : "PM";
  const dh   = h > 12 ? h - 12 : h;
  return { value: `${hh}:${mm}`, label: `${dh}:${mm} ${ampm}` };
});

const todayStr   = new Date().toISOString().split("T")[0];
const maxDateStr = `${new Date().getFullYear()}-12-31`; // only current year allowed

// ─── Inner component (needs useSearchParams) ───────────────────────────────

function AppointmentContent() {
  const router = useRouter();

  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_type: "",
    appointment_time: "",
    type: "",
    notes: "",
    status: "pending",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const nameParam = searchParams.get("name") || searchParams.get("schoolName");
  const idParam   = searchParams.get("id")   || searchParams.get("schoolId");

  useEffect(() => {
    if (nameParam) setFormData((prev) => ({ ...prev, appointment_type: nameParam }));
  }, [nameParam]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch("http://localhost:5000/api/parents/me", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setUserData({ name: data.name || "Not Set", email: data.email || "Not Set", phone: data.tel_no || "Not Set" });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Validate date & time ───────────────────────────────────────────────
    console.log("Selected appointment date:", formData.appointment_date);
    console.log("Selected appointment year:", formData.appointment_date ? new Date(formData.appointment_date).getFullYear() : "none");
    console.log("Preferred time:", formData.appointment_time);

    const newErrors = {};
    const dateErr = validateAppointmentDate(formData.appointment_date);
    if (dateErr) newErrors.appointment_date = dateErr;
    const timeErr = validateAppointmentTime(formData.appointment_time);
    if (timeErr) newErrors.appointment_time = timeErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    const bodyData = {
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      appointment_type: formData.appointment_type,
      notes:  formData.notes,
      status: "pending",
      type:   typeParam,
    };

    if      (typeParam === "sport")  bodyData.sport_center_id = idParam;
    else if (typeParam === "school") bodyData.school_id       = idParam;
    else if (typeParam === "clinic") bodyData.clinic_id       = idParam;

    console.log("Appointment payload:", bodyData);

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        const responseData = await res.json();
        saveExtraData(responseData.id, formData.appointment_time, formData.notes);
        showToast("Your appointment has been booked successfully!", "success");
        setFormData({
          appointment_date: "",
          appointment_type: nameParam || "",
          appointment_time: "",
          type: "",
          notes: "",
          status: "pending",
        });
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Something went wrong.", "error");
      }
    } catch {
      showToast("Cannot connect to server. Check if backend is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading Profile...</div>;

  return (
    <section className="appointment-section">
      <div className="appointment-wrapper">
        <h1>Appointment Form</h1>
        <p className="appointment-subtitle">
          Please fill the form below to schedule your visit.
        </p>

        <div className="appointment-card">
          <div className="card-content">
            <h2>Get In Touch</h2>
            <p className="card-subtitle">
              Verify your details and choose a preferred slot.
            </p>

            <form className="appointment-form" onSubmit={handleSubmit}>

              {/* READ-ONLY USER INFO */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={userData.name} readOnly className="readonly-input" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={userData.email} readOnly className="readonly-input" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" value={userData.phone} readOnly className="readonly-input" />
                </div>
                <div className="form-group">
                  <label>Appointment Type</label>
                  <input
                    type="text"
                    name="appointment_type"
                    value={formData.appointment_type || ""}
                    readOnly
                    className="readonly-input"
                    placeholder="Select Category"
                  />
                </div>
              </div>

              {/* DATE & TIME */}
              <div className="form-row">
                <div className={`form-group${errors.appointment_date ? " has-error" : ""}`}>
                  <label>
                    Preferred Date <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    required
                    min={todayStr}
                    max={maxDateStr}
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className={errors.appointment_date ? "input-field-error" : ""}
                  />
                  {errors.appointment_date && (
                    <span className="field-error">{errors.appointment_date}</span>
                  )}
                </div>

                <div className={`form-group${errors.appointment_time ? " has-error" : ""}`}>
                  <label>
                    Preferred Time <span className="required-star">*</span>
                    <small style={{ fontWeight: 400, color: "#888", marginLeft: 6 }}>
                      (8:00 AM – 10:00 PM)
                    </small>
                  </label>
                  <select
                    name="appointment_time"
                    required
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className={errors.appointment_time ? "input-field-error" : ""}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" }}
                  >
                    <option value="">Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                  {errors.appointment_time && (
                    <span className="field-error">{errors.appointment_time}</span>
                  )}
                </div>
              </div>

              {/* NOTES */}
              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  placeholder="Tell us more about your request..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="info-box">
                <h3>Terms &amp; Conditions</h3>
                <ul>
                  <li>Confirmations are sent via email.</li>
                  <li>Cancellations must be 24 hours in advance.</li>
                </ul>
              </div>

              <button type="submit" className="send-btn" disabled={loading}>
                {loading ? "Processing..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Appointment() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <AppointmentContent />
    </Suspense>
  );
}
