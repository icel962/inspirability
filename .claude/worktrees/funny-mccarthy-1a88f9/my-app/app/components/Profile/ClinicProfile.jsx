"use client";

import { useState } from "react";

export default function ClinicProfile({ user, formData, setFormData, handleSave }) {
  const [editMain, setEditMain] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [editContact, setEditContact] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="profile-grid">

      {/* ================= MAIN ================= */}
      <div className={`card ${editMain ? "editing" : ""}`}>
        <h3>{editMain ? "Editing Main Info..." : "Main Info"}</h3>

        {editMain ? (
          <>
            <div className="form-group">
              <label>Clinic Name</label>
              <input name="clinic_name" value={formData.clinic_name || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Clinic Type</label>
              <input name="clinic_type" value={formData.clinic_type || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input name="location" value={formData.location || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditMain(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.clinic_name || "N/A"}</p>
            <p><strong>Type:</strong> {user.clinic_type || "N/A"}</p>
            <p><strong>Location:</strong> {user.location || "N/A"}</p>

            <button onClick={() => setEditMain(true)}>Edit</button>
          </>
        )}
      </div>

      {/* ================= DETAILS ================= */}
      <div className={`card ${editDetails ? "editing" : ""}`}>
        <h3>{editDetails ? "Editing Details..." : "Details"}</h3>

        {editDetails ? (
          <>


            <div className="form-group">
              <label>Specialization</label>
              <input name="specialization_type" value={formData.specialization_type || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Working Hours</label>
              <input name="working_hours_and_days" value={formData.working_hours_and_days || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Session Price</label>
              <input name="session_price_range" value={formData.session_price_range || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditDetails(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Specialization:</strong> {user.specialization_type || "N/A"}</p>
            <p><strong>Working Hours:</strong> {user.working_hours_and_days || "N/A"}</p>
            <p><strong>Session Price:</strong> {user.session_price_range || "N/A"}</p>

            <button onClick={() => setEditDetails(true)}>Edit</button>
          </>
        )}
      </div>

      {/* ================= CONTACT ================= */}
      <div className={`card ${editContact ? "editing" : ""}`}>
        <h3>{editContact ? "Editing Contact..." : "Contact"}</h3>

        {editContact ? (
          <>
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={formData.email || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone_number" value={formData.phone_number || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditContact(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Phone:</strong> {user.phone_number || "N/A"}</p>

            <button onClick={() => setEditContact(true)}>Edit</button>
          </>
        )}
      </div>

    </div>
  );
}