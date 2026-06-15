"use client";

import { useRef, useState } from "react";
import { showToast } from "../../utils/toast";

const BASE_URL = "http://localhost:5000";

// ─── Text field ───────────────────────────────────────────────────────────────

function Field({ label, name, data, onChange, type = "text", textarea = false, span2 = false }) {
  return (
    <div className={`modal-field${span2 ? " span-2" : ""}`}>
      <label>{label}</label>
      {textarea ? (
        <textarea
          value={data[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={label}
        />
      ) : (
        <input
          type={type}
          value={data[name] || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={label}
        />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <>
      <p className="modal-section-title">{title}</p>
      <div className="modal-fields">{children}</div>
    </>
  );
}

// ─── Logo upload ──────────────────────────────────────────────────────────────

function LogoSection({ user, setProfile }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(
    user.image ? `${BASE_URL}/uploads/${user.image}` : null
  );
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    setUploading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/profile/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      console.log("Provider logo:", data.image);
      if (res.ok) {
        setProfile((prev) => ({
          ...prev,
          profile: { ...prev.profile, image: data.image },
        }));
        showToast("Logo updated successfully.", "success", "Logo Saved");
      } else {
        showToast(data.message || "Logo upload failed.", "error", "Upload Failed");
        setPreview(user.image ? `${BASE_URL}/uploads/${user.image}` : null);
      }
    } catch {
      showToast("Could not reach the server.", "error", "Upload Failed");
      setPreview(user.image ? `${BASE_URL}/uploads/${user.image}` : null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="modal-logo-section">
      <p className="modal-section-title">Logo / Profile Photo</p>
      <div className="modal-logo-row">
        <div className="modal-logo-preview">
          {preview ? (
            <img
              src={preview}
              alt="logo"
              className="modal-logo-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="modal-logo-placeholder">No Logo</div>
          )}
        </div>
        <div className="modal-logo-meta">
          <p className="modal-logo-hint">
            This logo appears on your profile, category cards, and the details page.
          </p>
          <label className={`modal-logo-btn${uploading ? " uploading" : ""}`}>
            {uploading ? "Uploading…" : "Replace Logo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── Document / photo upload field ────────────────────────────────────────────

function DocField({ label, accept, multiple = false }) {
  const inputRef = useRef(null);
  const [uploaded, setUploaded] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    files.forEach((f) => formData.append("media", f));

    console.log("Uploading media for provider:", label, files.map((f) => f.name));

    setUploading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      console.log("Upload response:", data);
      if (res.ok) {
        setUploaded((prev) => [...prev, ...files.map((f) => f.name)]);
        showToast(
          files.length === 1
            ? `"${files[0].name}" uploaded.`
            : `${files.length} files uploaded.`,
          "success",
          "Upload Done"
        );
      } else {
        showToast(data.message || "Upload failed.", "error", "Upload Failed");
      }
    } catch {
      showToast("Could not reach the server.", "error", "Upload Failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="modal-doc-field">
      <span className="modal-file-label">{label}</span>
      {uploaded.length > 0 && (
        <ul className="modal-doc-filelist">
          {uploaded.map((name, i) => (
            <li key={i} className="modal-doc-filename">✓ {name}</li>
          ))}
        </ul>
      )}
      <label className={`modal-file-wrapper${uploading ? " uploading" : ""}`}>
        <span className="modal-file-icon">📎</span>
        <span className="modal-file-btn">
          {uploading ? "Uploading…" : multiple ? "Choose Files" : "Choose File"}
        </span>
        <span className="modal-file-name">
          {uploading ? "Please wait…" : uploaded.length > 0 ? `${uploaded.length} uploaded` : "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}

// ─── Role-specific upload sections ────────────────────────────────────────────

function SchoolUploads() {
  return (
    <>
      <p className="modal-section-title">Documents &amp; Media</p>
      <div className="modal-upload-grid">
        <DocField label="Accreditation Certificate" accept="image/*,.pdf,.doc,.docx" />
        <DocField label="Ministry License / Approval" accept="image/*,.pdf,.doc,.docx" />
        <DocField label="Staff Certificates" accept="image/*,.pdf" />
        <DocField label="Brochure / PDF" accept=".pdf,image/*" />
        <DocField label="Campus Photos (multiple)" accept="image/*" multiple />
      </div>
    </>
  );
}

function ClinicUploads() {
  return (
    <>
      <p className="modal-section-title">Documents &amp; Media</p>
      <div className="modal-upload-grid">
        <DocField label="Doctor / Therapist Certificates" accept="image/*,.pdf" />
        <DocField label="Medical Licenses" accept="image/*,.pdf" />
        <DocField label="Other Verification Documents" accept="image/*,.pdf" />
        <DocField label="Clinic / Therapy Room Photos (multiple)" accept="image/*" multiple />
      </div>
    </>
  );
}

function SportUploads() {
  return (
    <>
      <p className="modal-section-title">Documents &amp; Media</p>
      <div className="modal-upload-grid">
        <DocField label="Coach Certifications" accept="image/*,.pdf" />
        <DocField label="Sports Licenses / Permits" accept="image/*,.pdf" />
        <DocField label="Other Verification Documents" accept="image/*,.pdf" />
        <DocField label="Training Facility Photos (multiple)" accept="image/*" multiple />
      </div>
    </>
  );
}

// ─── Per-role text fields ─────────────────────────────────────────────────────

function ParentFields({ data, onChange }) {
  return (
    <>
      <Section title="Personal Info">
        <Field label="Your Name"         name="username"               data={data} onChange={onChange} />
        <Field label="Phone"             name="tel_no"                 data={data} onChange={onChange} />
        <Field label="City"              name="city"                   data={data} onChange={onChange} />
        <Field label="Government"        name="government"             data={data} onChange={onChange} />
      </Section>
      <Section title="Child Info">
        <Field label="Child's Full Name"     name="name"                      data={data} onChange={onChange} />
        <Field label="Child Gender"          name="gender_child"              data={data} onChange={onChange} />
        <Field label="Date of Birth"         name="DOB_child"                 data={data} onChange={onChange} type="date" />
        <Field label="Education Level"       name="education_level_child"     data={data} onChange={onChange} />
        <Field label="Preferred Location"    name="preferred_location"        data={data} onChange={onChange} />
        <Field label="Preferred Budget (EGP, e.g. 500-800)" name="preferred_budget" data={data} onChange={onChange} />
        <Field label="Preferred Service Type"name="preferred_service_type"    data={data} onChange={onChange} />
      </Section>
    </>
  );
}

function SchoolFields({ data, onChange }) {
  return (
    <>
      <Section title="School Info">
        <Field label="School Name"          name="school_name"          data={data} onChange={onChange} />
        <Field label="Category"             name="category_of_school"   data={data} onChange={onChange} />
        <Field label="Curriculum Type"      name="curriculum_type"      data={data} onChange={onChange} />
        <Field label="City"                 name="city"                 data={data} onChange={onChange} />
        <Field label="Government"           name="government"           data={data} onChange={onChange} />
        <Field label="Location / Address"   name="location"             data={data} onChange={onChange} />
        <Field label="Phone"                name="tel_no"               data={data} onChange={onChange} />
      </Section>
      <Section title="Academics">
        <Field label="Educational Level"      name="educational_level"   data={data} onChange={onChange} />
        <Field label="Special Type"           name="special_type"        data={data} onChange={onChange} />
        <Field label="Class Capacity"         name="class_capacity"      data={data} onChange={onChange} type="number" />
        <Field label="Annual Fees (EGP)"      name="annual_fees"         data={data} onChange={onChange} />
        <Field label="Registration Fees (EGP)"name="registration_fees"   data={data} onChange={onChange} />
        <Field label="Social Media Links"     name="social_media_links"  data={data} onChange={onChange} />
      </Section>
      <Section title="About">
        <Field label="Admission Details"        name="admission_details" data={data} onChange={onChange} textarea span2 />
        <Field label="School History / About"   name="history_info"      data={data} onChange={onChange} textarea span2 />
      </Section>
    </>
  );
}

function SportFields({ data, onChange }) {
  return (
    <>
      <Section title="Center Info">
        <Field label="Center Name"              name="sport_center_name"          data={data} onChange={onChange} />
        <Field label="Center Type"              name="sport_center_type"          data={data} onChange={onChange} />
        <Field label="Location / Address"       name="location"                   data={data} onChange={onChange} />
        <Field label="Age Groups Accepted"      name="age"                        data={data} onChange={onChange} />
        <Field label="Working Days & Hours"     name="working_days_and_hours"     data={data} onChange={onChange} />
        <Field label="Session Price Min (EGP)"  name="session_price_min"          data={data} onChange={onChange} type="number" />
        <Field label="Session Price Max (EGP)"  name="session_price_max"          data={data} onChange={onChange} type="number" />
      </Section>
      <Section title="Services & Programs">
        <Field label="Sports Offered"                name="sports_type_offered"         data={data} onChange={onChange} />
        <Field label="Session Type (Private/Group)"  name="private_sessions_or_group"   data={data} onChange={onChange} />
        <Field label="Supported Conditions"          name="supported_conditions"        data={data} onChange={onChange} />
        <Field label="Coach Certifications"          name="coach_certifications"        data={data} onChange={onChange} />
        <Field label="Adaptive Equipment"            name="adaptive_equipments"         data={data} onChange={onChange} />
        <Field label="Staff Qualifications"          name="staff_qualifications"        data={data} onChange={onChange} textarea span2 />
        <Field label="Details / About"               name="details"                     data={data} onChange={onChange} textarea span2 />
        <Field label="More Info"                     name="more_info"                   data={data} onChange={onChange} textarea span2 />
      </Section>
      <Section title="Contact">
        <Field label="Phone"              name="phone_number"      data={data} onChange={onChange} />
        <Field label="Email"             name="email_address"     data={data} onChange={onChange} type="email" />
        <Field label="Social Media Links" name="social_media_links" data={data} onChange={onChange} span2 />
      </Section>
    </>
  );
}

function ClinicFields({ data, onChange }) {
  return (
    <>
      <Section title="Clinic Info">
        <Field label="Clinic Name"          name="clinic_name"            data={data} onChange={onChange} />
        <Field label="Clinic Type"          name="clinic_type"            data={data} onChange={onChange} />
        <Field label="Location / Address"   name="location"               data={data} onChange={onChange} />
        <Field label="Working Hours & Days" name="working_hours_and_days" data={data} onChange={onChange} />
        <Field label="Age Groups Served"    name="age"                    data={data} onChange={onChange} />
        <Field label="Session Type (Individual / Group)" name="private_sessions_or_group" data={data} onChange={onChange} />
      </Section>
      <Section title="Services">
        <Field label="Specialization Type"    name="specialization_type"        data={data} onChange={onChange} />
        <Field label="Specialized Therapists" name="specialized_therapists"     data={data} onChange={onChange} />
        <Field label="Session Price Range"    name="session_price_range"        data={data} onChange={onChange} />
        <Field label="Certifications"         name="certifications_availability" data={data} onChange={onChange} />
        <Field label="Adaptive Equipment"     name="sliding_equipments"         data={data} onChange={onChange} />
        <Field label="Services Offered"       name="details"                    data={data} onChange={onChange} textarea span2 />
        <Field label="Staff Qualifications"   name="staff_qualifications"       data={data} onChange={onChange} textarea span2 />
        <Field label="Additional Information" name="more_info"                  data={data} onChange={onChange} textarea span2 />
      </Section>
      <Section title="Contact">
        <Field label="Phone" name="phone_number" data={data} onChange={onChange} />
        <Field label="Email" name="email"        data={data} onChange={onChange} type="email" />
      </Section>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

export default function EditProfileModal({ user, role, onSave, onClose, saving, setProfile }) {
  const [localData, setLocalData] = useState(() => {
    const base = { ...user };
    if (base.DOB_child) base.DOB_child = toDateInputValue(base.DOB_child);
    return base;
  });

  const onChange = (name, value) =>
    setLocalData((prev) => ({ ...prev, [name]: value }));

  const isProvider = role === "school" || role === "clinic" || role === "sport" || role === "medical";

  const renderTextFields = () => {
    if (role === "parent")                       return <ParentFields data={localData} onChange={onChange} />;
    if (role === "school")                       return <SchoolFields data={localData} onChange={onChange} />;
    if (role === "sport")                        return <SportFields  data={localData} onChange={onChange} />;
    if (role === "clinic" || role === "medical") return <ClinicFields data={localData} onChange={onChange} />;
    return null;
  };

  const renderUploadFields = () => {
    if (role === "school")                       return <SchoolUploads />;
    if (role === "sport")                        return <SportUploads />;
    if (role === "clinic" || role === "medical") return <ClinicUploads />;
    return null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          {/* Logo upload — providers only */}
          {isProvider && setProfile && (
            <LogoSection user={user} setProfile={setProfile} />
          )}

          {/* Text fields */}
          {renderTextFields()}

          {/* Document / media uploads — providers only */}
          {isProvider && renderUploadFields()}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="modal-save-btn" onClick={() => onSave(localData)} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
