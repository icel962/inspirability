"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveExtraData } from "../utils/appointmentExtraStorage";
import "./appointment.css";

export default function Appointment() {
  const router = useRouter();
  
  // State for user data (read-only)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // State for form submission
  const [formData, setFormData] = useState({
    appointment_date: "",
     appointment_type: "",
    appointment_time: "",
    type: "",
    notes: "",
    status: "pending"
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const nameParam = searchParams.get("name") || searchParams.get("schoolName");
  const idParam = searchParams.get("id") || searchParams.get("schoolId");

  useEffect(() => {
    if (nameParam) {
      setFormData((prev) => ({
        ...prev,
        appointment_type: nameParam,
      }));
    }
  }, [nameParam]);
  // 1. Fetch User Profile Data on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/parents/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setUserData({
          name: data.name || "Not Set",
          email: data.email || "Not Set",
          phone: data.tel_no || "Not Set" // Maps to tel_no in your DB
        });
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, [router]);

  // 2. Handle Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Submit Appointment
const handleSubmit = async (e) => {
  e.preventDefault();

   console.log("FORM DATA 👉", formData);

  const token = localStorage.getItem("token");
  setLoading(true);

  let bodyData = {
    appointment_date: formData.appointment_date,
    appointment_time: formData.appointment_time,
appointment_type: formData.appointment_type,
    notes: formData.notes,
    status: "pending",
    type: typeParam,
  };

   console.log("BODY DATA 👉", bodyData);

 
  if (typeParam === "sport") {
    bodyData.sport_center_id = idParam;
  } else if (typeParam === "school") {
    bodyData.school_id = idParam;
  } else if (typeParam === "clinic") {
    bodyData.clinic_id = idParam;
  }

  try {
const res = await fetch("http://localhost:5000/api/appointments", {    
    method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

      if (res.ok) {
        const responseData = await res.json();
        saveExtraData(
          responseData.id,
          formData.appointment_time,
          formData.notes
        );

        alert("Success! Your appointment has been booked.");
        setFormData({
          appointment_date: "",
          appointment_type: nameParam || "",
          appointment_time: "",
          type: "",
          notes: "",
          status: "pending"
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Something went wrong.");
      }
    } catch (err) {
      alert("Cannot connect to server. Check if backend is running.");
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
                  <input 
                    type="text" 
                    value={userData.name} 
                    readOnly 
                    className="readonly-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email} 
                    readOnly 
                    className="readonly-input" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={userData.phone} 
                    readOnly 
                    className="readonly-input" 
                  />
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

              {/* DATE AND TIME */}
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    name="appointment_date" 
                    required 
                    value={formData.appointment_date} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Time</label>
                  <input 
                    type="time" 
                    name="appointment_time" 
                    required 
                    value={formData.appointment_time} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              {/* ADDITIONAL NOTES */}
              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea 
                  name="notes" 
                  placeholder="Tell us more about your request..." 
                  value={formData.notes} 
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="info-box">
                <h3>Terms & Conditions</h3>
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
