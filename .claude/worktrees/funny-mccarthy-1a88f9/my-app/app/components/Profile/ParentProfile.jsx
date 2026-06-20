"use client";

import { useState } from "react";

export default function ParentProfile({ user, formData, setFormData, handleSave }) {
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
              <label>Name</label>
              <input name="name" value={formData.name || ""} onChange={handleChange} />
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
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>City:</strong> {user.city || "N/A"}</p>
            <p><strong>Government:</strong> {user.government || "N/A"}</p>

            <button onClick={() => setEditMain(true)}>Edit</button>
          </>
        )}
      </div>

      {/* ================= DETAILS ================= */}
      <div className={`card ${editDetails ? "editing" : ""}`}>
        <h3>{editDetails ? "Editing Kid Info..." : "Kid Info"}</h3>

        {editDetails ? (
          <>
            <div className="form-group">
              <label>Document Upload</label>
              <input name="document_upload" value={formData.document_upload || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <input name="gender_child" value={formData.gender_child || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Education Level</label>
              <input name="education_level_child" value={formData.education_level_child || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input name="DOB_child" value={formData.DOB_child || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditDetails(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Document:</strong> {user.document_upload || "N/A"}</p>
            <p><strong>Gender:</strong> {user.gender_child || "N/A"}</p>
            <p><strong>Education:</strong> {user.education_level_child || "N/A"}</p>
            <p><strong>DOB:</strong> {user.DOB_child || "N/A"}</p>

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