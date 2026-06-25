"use client";

import { useState } from "react";
import Image from "next/image";
import "./signup.css";
import { useRouter } from "next/navigation";
import { showToast } from "../utils/toast";
import {
  EGYPT_GOVERNORATES,
  SPECIAL_TYPES,
  SCHOOL_CATEGORIES,
  CURRICULUM_TYPES,
  CLINIC_TYPES,
  SPECIALIZATION_TYPES,
  SPORT_CENTER_TYPES,
  SPORTS_TYPES,
  SUPPORTED_CONDITIONS,
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateRequired,
  validateNationalId,
  validatePositiveNumber,
} from "../utils/validation";

// ─── Lookup constants ─────────────────────────────────────────────────────────

const SCHOOL_ED_LEVELS = [
  "Nursery",
  "Kindergarten",
  "Primary (Grades 1–6)",
  "Preparatory (Grades 7–9)",
  "Secondary (Grades 10–12)",
  "Special Education Only",
];

// ─── Static role field definitions ────────────────────────────────────────────

const ROLE_FIELDS = {
  Parent: [
    { name: "name",                 placeholder: "Child's Full Name",              type: "text",     required: true  },
    { name: "phone",                placeholder: "Phone Number",                   type: "tel",      required: true  },
    { name: "nationalId",           placeholder: "National ID (14 digits)",        type: "text",     required: true  },
    { name: "email",                placeholder: "Email Address",                  type: "email",    required: true  },
    { name: "password",             placeholder: "Password",                       type: "password", required: true  },
    { name: "username",             placeholder: "Username",                       type: "text",     required: true  },
    { name: "government",           placeholder: "Governorate",                    type: "select",   required: true,  options: EGYPT_GOVERNORATES },
    { name: "city",                 placeholder: "City",                           type: "text",     required: true  },
    { name: "location",             placeholder: "Full Address",                   type: "text"                      },
    { name: "preferredLocation",    placeholder: "Preferred Service Location",     type: "text"                      },
    { name: "preferredBudget",      placeholder: "Preferred Budget (EGP)",         type: "number"                    },
    { name: "preferredServiceType", placeholder: "Preferred Service Type",         type: "select",   options: ["School", "Medical Clinic", "Sport Center"] },
    { name: "educationalLevel",     placeholder: "Child's Educational Level",      type: "select",   options: ["Kindergarten","Primary","Preparatory","Secondary","Special Education"] },
    { name: "dob",                  placeholder: "Child's Date of Birth",          type: "date"                      },
    { name: "gender",               placeholder: "Child's Gender",                 type: "select",   options: ["Male", "Female"] },
    { name: "file1",                placeholder: "Upload Document 1 (optional)",   type: "file",     accept: "image/*,.pdf" },
    { name: "file2",                placeholder: "Upload Document 2 (optional)",   type: "file",     accept: "image/*,.pdf" },
  ],

  School: [
    // ── Basic Info
    { name: "name",                       placeholder: "School Name",                        type: "text",        required: true  },
    { name: "categoryOfSchool",           placeholder: "Category of School",                 type: "select",      required: true,  options: SCHOOL_CATEGORIES },
    { name: "curriculumType",             placeholder: "Curriculum Type",                    type: "select",      required: true,  options: CURRICULUM_TYPES  },
    { name: "location",                   placeholder: "Street Address",                     type: "text",        required: true  },
    { name: "city",                       placeholder: "City",                               type: "text",        required: true  },
    { name: "government",                 placeholder: "Governorate",                        type: "select",      required: true,  options: EGYPT_GOVERNORATES },
    // ── Contact & Academics
    { name: "phone",                      placeholder: "Phone Number",                       type: "tel",         required: true  },
    { name: "email",                      placeholder: "Email Address",                      type: "email",       required: true  },
    { name: "educationalLevel",           placeholder: "Educational Levels Offered",         type: "multiselect", required: true,  options: SCHOOL_ED_LEVELS },
    { name: "classCapacity",              placeholder: "Class Capacity",                     type: "number"                       },
    { name: "registrationFees",           placeholder: "Registration Fees (EGP)",            type: "number"                       },
    { name: "annualFees",                 placeholder: "Annual Fees (EGP)",                  type: "number"                       },
    // ── Details
    { name: "admissionDetails",           placeholder: "Admission Details",                  type: "textarea"                     },
    { name: "historyInfo",                placeholder: "School History & Info",              type: "textarea"                     },
    { name: "shadowAvailability",         placeholder: "Shadow Teacher Available",           type: "select",      options: ["Yes", "No"] },
    { name: "specialType",                placeholder: "Special Needs Focus",                type: "select",      options: SPECIAL_TYPES  },
    { name: "teacherTrainingStatus",      placeholder: "Teacher Training Status",            type: "select",      options: ["Trained", "In Training", "Not Trained", "N/A"] },
    { name: "certificationsAvailability", placeholder: "Certifications Available",           type: "select",      options: ["Yes", "No"] },
    // ── Online & Account
    { name: "socialMediaLinks",           placeholder: "Social Media Links (optional)",      type: "text"                         },
    { name: "website",                    placeholder: "Website URL (optional)",             type: "text"                         },
    { name: "password",                   placeholder: "Password",                           type: "password",    required: true  },
    // ── Documents & Media
    { name: "logo",                       placeholder: "School Logo",                        type: "file",        accept: "image/*",              preview: true  },
    { name: "accreditationCert",          placeholder: "Accreditation Certificate",          type: "file",        accept: "image/*,.pdf,.doc,.docx" },
    { name: "ministryLicense",            placeholder: "Ministry Approval / License",        type: "file",        accept: "image/*,.pdf,.doc,.docx" },
    { name: "campusPhotos",              placeholder: "Campus Photos (select multiple)",     type: "file",        accept: "image/*",              multiple: true },
    { name: "staffCertificates",          placeholder: "Staff Certificates (optional)",      type: "file",        accept: "image/*,.pdf"          },
    { name: "brochure",                   placeholder: "Brochure / PDF (optional)",          type: "file",        accept: ".pdf,image/*"          },
  ],

  Clinic: [
    // ── Basic Info
    { name: "name",                       placeholder: "Clinic Name",                        type: "text",        required: true  },
    { name: "clinicType",                 placeholder: "Clinic Type",                        type: "select",      required: true,  options: CLINIC_TYPES           },
    { name: "email",                      placeholder: "Email Address",                      type: "email",       required: true  },
    { name: "phone",                      placeholder: "Phone Number",                       type: "tel",         required: true  },
    { name: "location",                   placeholder: "Clinic Address",                     type: "text",        required: true  },
    { name: "workingHours",               placeholder: "Working Hours & Days",               type: "text",        required: true  },
    // ── Clinical Details
    { name: "specializationType",         placeholder: "Specialization Type",                type: "select",      required: true,  options: SPECIALIZATION_TYPES   },
    { name: "specializedTherapists",      placeholder: "No. of Specialized Therapists",      type: "number"                       },
    { name: "sessionPriceRange",          placeholder: "Session Price Range (e.g. 200–500 EGP)", type: "text"                    },
    { name: "certificationsAvailability", placeholder: "Certifications Available",           type: "select",      required: true,  options: ["Yes", "No"]          },
    { name: "slidingEquipments",          placeholder: "Adaptive / Sliding Equipment",       type: "select",      options: ["Yes", "No"]          },
    { name: "password",                   placeholder: "Password",                           type: "password",    required: true  },
    // ── Documents & Media
    { name: "logo",                       placeholder: "Clinic Logo",                        type: "file",        accept: "image/*",              preview: true  },
    { name: "doctorCertificates",         placeholder: "Doctor / Therapist Certificates",    type: "file",        accept: "image/*,.pdf"          },
    { name: "medicalLicenses",            placeholder: "Medical Licenses",                   type: "file",        accept: "image/*,.pdf"          },
    { name: "clinicPhotos",              placeholder: "Clinic / Therapy Room Photos (multiple)", type: "file",    accept: "image/*",              multiple: true },
    { name: "documents",                  placeholder: "Other Verification Docs (optional)", type: "file",        accept: "image/*,.pdf"          },
  ],

  Sport: [
    // ── Basic Info
    { name: "name",                     placeholder: "Sport Center Name",              type: "text",        required: true  },
    { name: "sportCenterType",          placeholder: "Sport Center Type",              type: "select",      required: true,  options: SPORT_CENTER_TYPES  },
    { name: "location",                 placeholder: "Center Address",                 type: "text",        required: true  },
    { name: "phone",                    placeholder: "Phone Number",                   type: "tel",         required: true  },
    { name: "email",                    placeholder: "Email Address",                  type: "email",       required: true  },
    { name: "workingHours",             placeholder: "Working Days & Hours",           type: "text",        required: true  },
    // ── Sports Details
    { name: "sportsTypeOffered",        placeholder: "Sports Type Offered",            type: "select",      required: true,  options: SPORTS_TYPES        },
    { name: "privateSessions",          placeholder: "Session Type",                   type: "select",      required: true,  options: ["Private", "Group"] },
    { name: "supportedConditions",      placeholder: "Supported Conditions",           type: "select",      required: true,  options: SUPPORTED_CONDITIONS },
    { name: "age",                      placeholder: "Age Range Served (e.g. 6–18)",   type: "text"                         },
    { name: "specialCoachAvailability", placeholder: "Special Coach Available",        type: "select",      options: ["Yes", "No"] },
    { name: "adaptiveEquipments",       placeholder: "Adaptive Equipment Available",   type: "select",      options: ["Yes", "No"] },
    // ── Qualifications & Info
    { name: "staffQualifications",      placeholder: "Staff Qualifications",           type: "text"                         },
    { name: "description",              placeholder: "Center Description",             type: "textarea"                     },
    { name: "sessionPriceMin",          placeholder: "Min Session Price (EGP)",        type: "number"                       },
    { name: "sessionPriceMax",          placeholder: "Max Session Price (EGP)",        type: "number"                       },
    { name: "socialMediaLinks",         placeholder: "Social Media Links (optional)",  type: "text"                         },
    { name: "password",                 placeholder: "Password",                       type: "password",    required: true  },
    // ── Documents & Media
    { name: "logo",                     placeholder: "Center Logo",                    type: "file",        accept: "image/*",              preview: true  },
    { name: "coachCertifications",      placeholder: "Coach Certificates",             type: "file",        accept: "image/*,.pdf"          },
    { name: "sportsLicenses",           placeholder: "Sports Licenses / Permits",      type: "file",        accept: "image/*,.pdf"          },
    { name: "facilityPhotos",           placeholder: "Training Facility Photos (multiple)", type: "file",   accept: "image/*",              multiple: true },
    { name: "documents",                placeholder: "Other Verification Docs (optional)", type: "file",    accept: "image/*,.pdf"          },
  ],
};

const ROLES = [
  { name: "Parent", img: "/images/Parent.png" },
  { name: "School", img: "/images/School.png" },
  { name: "Clinic", img: "/images/Clinic.png" },
  { name: "Admin",  img: "/images/Admin.png"  },
  { name: "Sport",  img: "/images/Sport.png"  },
];

const NUMERIC_FIELDS = [
  "annualFees", "registrationFees", "classCapacity",
  "sessionPriceMin", "sessionPriceMax", "specializedTherapists",
];

function getFieldGroups(role) {
  const fields = ROLE_FIELDS[role] || [];
  const groups = [];
  for (let i = 0; i < fields.length; i += 6) groups.push(fields.slice(i, i + 6));
  return groups;
}

const INITIAL_FORM_DATA = {
  name: "", email: "", password: "", phone: "", username: "",
  nationalId: "", government: "", city: "", location: "",
  preferredLocation: "", preferredBudget: "", preferredServiceType: "",
  educationalLevel: [], dob: "", gender: "",
  file1: null, file2: null,
  socialMediaLinks: "", description: "", website: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Signup() {
  const [step, setStep]     = useState(1);
  const [role, setRole]     = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const router = useRouter();
  const fieldGroups = getFieldGroups(role);
  const totalSteps  = 1 + fieldGroups.length + 1;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelect = (r) => {
    if (r === "Admin") {
      showToast("Admin accounts cannot sign up here.", "warning");
      router.push("/login");
      return;
    }
    setRole(r);
    setErrors({});
    setFormData(INITIAL_FORM_DATA);
    setTimeout(() => setStep(2), 200);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const field = ROLE_FIELDS[role]?.find((f) => f.name === name);
      if (field?.multiple) {
        const fileArray = Array.from(files);
        console.log("Uploaded files:", { [name]: fileArray.map((f) => f.name) });
        setFormData((prev) => ({ ...prev, [name]: fileArray }));
      } else {
        const file = files[0] || null;
        console.log("Uploaded file:", { [name]: file?.name });
        let preview = null;
        if (file && field?.preview && file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }
        setFormData((prev) => ({ ...prev, [name]: file, [`${name}_preview`]: preview }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiToggle = (name, val) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[name]) ? prev[name] : [];
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      return { ...prev, [name]: next };
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ── Per-step validation ───────────────────────────────────────────────────

  const validateStepFields = (groupIndex) => {
    const group = fieldGroups[groupIndex] || [];
    const newErrors = {};

    for (const field of group) {
      const { name, placeholder, type, required } = field;

      if (type === "file") continue;

      if (type === "multiselect") {
        if (required) {
          const val = Array.isArray(formData[name]) ? formData[name] : [];
          if (val.length === 0) newErrors[name] = `${placeholder} is required.`;
        }
        continue;
      }

      const value = formData[name];
      let err = null;

      if      (name === "email")      err = validateEmail(value);
      else if (name === "phone")      err = validatePhone(value);
      else if (name === "password")   err = validatePassword(value);
      else if (name === "name")       err = validateName(value, placeholder);
      else if (name === "nationalId") err = validateNationalId(value);
      else if (NUMERIC_FIELDS.includes(name)) {
        if (value) err = validatePositiveNumber(value, placeholder);
      } else if (required) {
        err = validateRequired(value, placeholder);
      }

      if (err) newErrors[name] = err;
    }

    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleNext = () => {
    const groupIndex = step - 2;
    if (groupIndex >= 0 && groupIndex < fieldGroups.length) {
      const result = validateStepFields(groupIndex);
      if (!result.valid) {
        setErrors(result.errors);
        showToast("Please fix the highlighted errors before continuing.", "warning");
        return;
      }
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const back = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key.endsWith("_preview")) return;
        const val = formData[key];
        if (val === null || val === undefined || val === "") return;

        if (Array.isArray(val)) {
          if (val.length === 0) return;
          if (val[0] instanceof File) {
            val.forEach((f) => dataToSend.append(key, f));
          } else {
            dataToSend.append(key, val.join(","));
          }
        } else {
          dataToSend.append(key, val);
        }
      });

      dataToSend.append("role", role);

      const res  = await fetch("http://localhost:5000/api/signup", { method: "POST", body: dataToSend });
      const data = await res.json();

      if (!res.ok) return showToast(data.message || "Signup failed", "error");

      showToast("Signup successful! Redirecting to login...", "success");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      showToast("Server error. Make sure the backend is running.", "error");
    }
  };

  // ── Field renderer ────────────────────────────────────────────────────────

  const renderField = (field) => {
    const { name, placeholder, type, options, required, accept, multiple, preview } = field;
    const value    = formData[name];
    const hasError = !!errors[name];
    const label    = required ? `${placeholder} *` : placeholder;

    // ── Multiselect (checkbox chips)
    if (type === "multiselect") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div key={name} className="input-group">
          <span className="field-section-label">
            {label}
          </span>
          <div className="multiselect-grid">
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label key={opt} className={`multiselect-option${checked ? " checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleMultiToggle(name, opt)}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {hasError && <span className="field-error">{errors[name]}</span>}
        </div>
      );
    }

    // ── Textarea
    if (type === "textarea") {
      return (
        <div key={name} className="input-group">
          <textarea
            name={name}
            placeholder={label}
            value={value ?? ""}
            onChange={handleChange}
            className={hasError ? "input-error" : ""}
          />
          {hasError && <span className="field-error">{errors[name]}</span>}
        </div>
      );
    }

    // ── Select
    if (type === "select") {
      const scalarValue = Array.isArray(value) ? "" : (value ?? "");
      return (
        <div key={name} className="input-group">
          <select
            className={`radio-gender-btn${hasError ? " input-error" : ""}`}
            name={name}
            value={scalarValue}
            onChange={handleChange}
          >
            <option value="">{label}</option>
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {hasError && <span className="field-error">{errors[name]}</span>}
        </div>
      );
    }

    // ── File upload
    if (type === "file") {
      const fileAccept = accept || "image/*,.pdf,.doc,.docx";
      let displayName = "";
      const previewUrl = preview ? formData[`${name}_preview`] : null;

      if (multiple && Array.isArray(value)) {
        displayName = value.length > 0 ? `${value.length} file(s) selected` : "";
      } else if (value instanceof File) {
        displayName = value.name;
      }

      return (
        <div key={name} className="input-group">
          <span className="file-label">{label}</span>
          {previewUrl && (
            <div className="logo-preview-wrap">
              <img src={previewUrl} alt="logo preview" className="logo-preview-img" />
              <span className="logo-preview-name">{displayName}</span>
            </div>
          )}
          <label className="file-upload-wrapper" htmlFor={`file-${name}`}>
            <span className="file-upload-icon">📎</span>
            <span className="file-upload-btn">
              {multiple ? "Choose Files" : "Choose File"}
            </span>
            <span className="file-upload-name">
              {!previewUrl && (displayName || "No file chosen")}
            </span>
            <input
              id={`file-${name}`}
              type="file"
              name={name}
              onChange={handleChange}
              accept={fileAccept}
              multiple={!!multiple}
              style={{ display: "none" }}
            />
          </label>
        </div>
      );
    }

    // ── Default text/number/password/date/tel/email
    return (
      <div key={name} className="input-group">
        <input
          type={type}
          name={name}
          placeholder={label}
          value={value ?? ""}
          onChange={handleChange}
          className={hasError ? "input-error" : ""}
        />
        {hasError && <span className="field-error">{errors[name]}</span>}
      </div>
    );
  };

  // ── Section label for upload steps
  const currentGroup = fieldGroups[step - 2] || [];
  const isUploadStep = currentGroup.some((f) => f.type === "file");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="signup">
      <div className="signup-container">

        {/* LEFT – step indicator */}
        <div className="left">
          <h1>Sign-up</h1>
          <p>Follow the steps to save your data</p>
          <div className="steps">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`circle ${step === s ? "active" : ""} ${step > s ? "done" : ""}`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – form content */}
        <div className="right">

          {/* Step 1 – role selection */}
          {step === 1 && (
            <div className="role-selection">
              <h2>Select Role</h2>
              <div className="roles">
                {ROLES.map((r) => (
                  <div
                    key={r.name}
                    className={`role-card ${role === r.name ? "selected" : ""}`}
                    onClick={() => handleSelect(r.name)}
                  >
                    <Image src={r.img} alt={r.name} width={100} height={100} />
                    <div className="overlay"></div>
                    <span className="role-name">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps 2..N-1 – field groups */}
          {step > 1 && step < totalSteps && (
            <div className="form-step">
              <h2>
                {role} Details
                {isUploadStep && (
                  <span className="upload-step-badge">Documents & Media</span>
                )}
              </h2>
              <p className="step-counter">Step {step - 1} of {totalSteps - 2}</p>
              {fieldGroups[step - 2].map(renderField)}
              <div className="btns">
                <button onClick={back}>Back</button>
                <button onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* Final step – submit */}
          {step === totalSteps && (
            <div className="success-box">
              <div className="check-circle">✓</div>
              <h3 className="subtitle">Data Recorded Successfully</h3>
              <p className="subtitle">Click below to finish your registration.</p>
              <div className="btns">
                <button onClick={back}>Back</button>
                <button onClick={handleSubmit}>Submit &amp; Go to Login</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
