"use client";

import { useState } from "react";

export default function SchoolProfile({ user, formData, setFormData, handleSave }) {
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
              <label>School Name</label>
              <input name="school_name" value={formData.school_name || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>City</label>
              <input name="city" value={formData.city || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Government</label>
              <input name="government" value={formData.government || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditMain(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.school_name || "N/A"}</p>
            <p><strong>City:</strong> {user.city || "N/A"}</p>
            <p><strong>Government:</strong> {user.government || "N/A"}</p>

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
              <label>Educational Level</label>
              <input name="educational_level" value={formData.educational_level || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Special Type</label>
              <input name="special_type" value={formData.special_type || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Admission Details</label>
              <textarea name="admission_details" value={formData.admission_details || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>History Info</label>
              <textarea name="history_info" value={formData.history_info || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditDetails(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Level:</strong> {user.educational_level || "N/A"}</p>
            <p><strong>Type:</strong> {user.special_type || "N/A"}</p>
            <p><strong>Admission:</strong> {user.admission_details || "N/A"}</p>
            <p><strong>History:</strong> {user.history_info || "N/A"}</p>

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
              <input value={user.email || ""} disabled />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="tel_no" value={formData.tel_no || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditContact(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Phone:</strong> {user.tel_no || "N/A"}</p>

            <button onClick={() => setEditContact(true)}>Edit</button>
          </>
        )}
      </div>

    </div>
  );
}