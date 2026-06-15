"use client";

import { useState } from "react";

export default function SportProfile({ user, formData, setFormData, handleSave }) {
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
              <input name="sport_center_name" value={formData.sport_center_name || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Type</label>
              <input name="sport_center_type" value={formData.sport_center_type || ""} onChange={handleChange} />
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
            <p><strong>Name:</strong> {user.sport_center_name || "N/A"}</p>
            <p><strong>Type:</strong> {user.sport_center_type || "N/A"}</p>
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
              <label>Sports Offered</label>
              <input name="sports_type_offered" value={formData.sports_type_offered || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Working Days & Hours</label>
              <input name="working_days_and_hours" value={formData.working_days_and_hours || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input name="age" value={formData.age || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Staff Qualifications</label>
              <input name="staff_qualifications" value={formData.staff_qualifications || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Coach Certifications</label>
              <input name="coach_certifications" value={formData.coach_certifications || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Session Type</label>
              <input name="private_sessions_or_group" value={formData.private_sessions_or_group || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Special Coach</label>
              <input name="special_coach_availability" value={formData.special_coach_availability || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Equipments</label>
              <input name="adaptive_equipments" value={formData.adaptive_equipments || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Supported Conditions</label>
              <input name="supported_conditions" value={formData.supported_conditions || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Details</label>
                            <br></br>
              <textarea name="details" value={formData.details || ""} onChange={handleChange} />
            </div>

            

            <div className="form-group">
              <label>Price Min</label>
              <input name="session_price_min" value={formData.session_price_min || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Price Max</label>
              <input name="session_price_max" value={formData.session_price_max || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>More Info</label>
              <br></br>
              <textarea name="more_info" value={formData.more_info || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditDetails(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Sports:</strong> {user.sports_type_offered || "N/A"}</p>
            <p><strong>Working:</strong> {user.working_days_and_hours || "N/A"}</p>
            <p><strong>Age:</strong> {user.age || "N/A"}</p>
            <p><strong>Staff:</strong> {user.staff_qualifications || "N/A"}</p>
            <p><strong>Coach Cert:</strong> {user.coach_certifications || "N/A"}</p>
            <p><strong>Session:</strong> {user.private_sessions_or_group || "N/A"}</p>
            <p><strong>Special Coach:</strong> {user.special_coach_availability || "N/A"}</p>
            <p><strong>Equipments:</strong> {user.adaptive_equipments || "N/A"}</p>
            <p><strong>Conditions:</strong> {user.supported_conditions || "N/A"}</p>
            <p><strong>Details:</strong> {user.details || "N/A"}</p>
            <p><strong>Price:</strong> {user.session_price_min || "N/A"} - {user.session_price_max || ""}</p>
            <p><strong>More Info:</strong> {user.more_info || "N/A"}</p>
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
              <input name="email_address" value={formData.email_address || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone_number" value={formData.phone_number || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Social Media</label>
              <input name="social_media_links" value={formData.social_media_links || ""} onChange={handleChange} />
            </div>

            <button className="save-btn" onClick={() => { handleSave(); setEditContact(false); }}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {user.email_address || "N/A"}</p>
            <p><strong>Phone:</strong> {user.phone_number || "N/A"}</p>
            <p><strong>Social:</strong> {user.social_media_links || "N/A"}</p>

            <button onClick={() => setEditContact(true)}>Edit</button>
          </>
        )}
      </div>

    </div>
  );
}