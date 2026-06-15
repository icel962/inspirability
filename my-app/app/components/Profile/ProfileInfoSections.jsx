"use client";

const BASE_URL = "http://localhost:5000";

function Val({ v }) {
  return (v !== null && v !== undefined && v !== "") ? (
    <span className="info-value">{v}</span>
  ) : (
    <span className="info-value empty">Not provided</span>
  );
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function DocumentsCard({ raw }) {
  if (!raw) return null;
  const files = String(raw).split(",").map((f) => f.trim()).filter(Boolean);
  if (files.length === 0) return null;
  return (
    <div className="info-card">
      <div className="info-card-header">
        <span className="info-card-title">Uploaded Documents</span>
      </div>
      <div className="info-row">
        {files.map((file, i) => {
          const url = `${BASE_URL}/uploads/${file}`;
          const isPdf = file.toLowerCase().endsWith(".pdf");
          return (
            <div key={i} className="info-field">
              <span className="info-label">Document {i + 1}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="info-value info-doc-link"
              >
                {isPdf ? "📄" : "🖼️"} {file.replace(/^\d+-/, "")}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoCard({ title, fields }) {
  const nonEmpty = fields.filter(([, v]) => v);
  if (nonEmpty.length === 0) return null;
  return (
    <div className="info-card">
      <div className="info-card-header">
        <span className="info-card-title">{title}</span>
      </div>
      <div className="info-row">
        {fields.map(([label, value]) => (
          <div key={label} className="info-field">
            <span className="info-label">{label}</span>
            <Val v={value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function yesNo(v) {
  if (v === null || v === undefined || v === "") return null;
  return Number(v) === 1 || v === true || v === "Yes" ? "Yes" : "No";
}

function priceRange(min, max) {
  if (!min && !max) return null;
  if (min && max) return `${min} – ${max} EGP`;
  return `${min || max} EGP`;
}

function getSections(user, role) {
  if (role === "parent") {
    return [
      ["Personal Info", [
        ["Name", user.username],
        ["Phone", user.tel_no],
        ["Email", user.email],
        ["City", user.city],
        ["Government", user.government],
      ]],
      ["Child Info", [
        ["Child's Name", user.name],
        ["Gender", user.gender_child],
        ["Date of Birth", formatDate(user.DOB_child)],
        ["Education Level", user.education_level_child],
        ["Preferred Location", user.preferred_location],
        ["Preferred Budget", (user.preferred_budget !== null && user.preferred_budget !== undefined && user.preferred_budget !== "") ? `${String(user.preferred_budget).replace(/\.0+$/, "")} EGP` : null],
        ["Preferred Service", user.preferred_service_type],
      ]],
    ];
  }

  if (role === "school") {
    return [
      ["School Info", [
        ["School Name", user.school_name],
        ["Category", user.category_of_school],
        ["Curriculum", user.curriculum_type],
        ["City", user.city],
        ["Government", user.government],
        ["Location", user.location],
      ]],
      ["Academics", [
        ["Educational Level", user.educational_level],
        ["Special Type", user.special_type],
        ["Class Capacity", user.class_capacity],
        ["Shadow Availability", yesNo(user.shadow_availability)],
        ["Teacher Training", yesNo(user.teacher_training_status)],
        ["Certifications", yesNo(user.certifications_availability)],
      ]],
      ["Admissions & Fees", [
        ["Annual Fees", user.annual_fees],
        ["Registration Fees", user.registration_fees],
        ["Admission Details", user.admission_details],
        ["About / History", user.history_info],
      ]],
      ["Contact", [
        ["Phone", user.tel_no],
        ["Email", user.email],
        ["Social Media", user.social_media_links],
      ]],
    ];
  }

  if (role === "sport") {
    return [
      ["Center Info", [
        ["Center Name", user.sport_center_name],
        ["Type", user.sport_center_type],
        ["Location", user.location],
        ["Age Groups", user.age],
      ]],
      ["Services & Programs", [
        ["Sports Offered", user.sports_type_offered],
        ["Session Type", user.private_sessions_or_group],
        ["Supported Conditions", user.supported_conditions],
        ["Details", user.details],
        ["More Info", user.more_info],
        ["Price Range", priceRange(user.session_price_min, user.session_price_max)],
      ]],
      ["Staff & Equipment", [
        ["Working Hours", user.working_days_and_hours],
        ["Staff Qualifications", user.staff_qualifications],
        ["Coach Certifications", user.coach_certifications],
        ["Special Coach", yesNo(user.special_coach_availability)],
        ["Adaptive Equipment", user.adaptive_equipments],
      ]],
      ["Contact", [
        ["Phone", user.phone_number],
        ["Email", user.email_address],
        ["Social Media", user.social_media_links],
      ]],
    ];
  }

  if (role === "clinic" || role === "medical") {
    return [
      ["Clinic Info", [
        ["Clinic Name", user.clinic_name],
        ["Type", user.clinic_type],
        ["Location", user.location],
        ["Age Groups Served", user.age],
        ["Session Type", user.private_sessions_or_group],
      ]],
      ["Services", [
        ["Specialization", user.specialization_type],
        ["Specialized Therapists", user.specialized_therapists],
        ["Session Price", user.session_price_range],
        ["Certifications", user.certifications_availability],
        ["Adaptive Equipment", user.sliding_equipments],
        ["Services Offered", user.details],
        ["Staff Qualifications", user.staff_qualifications],
        ["Additional Information", user.more_info],
      ]],
      ["Schedule & Contact", [
        ["Working Hours", user.working_hours_and_days],
        ["Phone", user.phone_number],
        ["Email", user.email],
      ]],
    ];
  }

  return [];
}

export default function ProfileInfoSections({ user, role }) {
  const sections = getSections(user, role);
  return (
    <div className="profile-sections">
      {sections.map(([title, fields]) => (
        <InfoCard key={title} title={title} fields={fields} />
      ))}
      {role === "parent" && <DocumentsCard raw={user.document_upload} />}
    </div>
  );
}
