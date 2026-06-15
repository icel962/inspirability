"use client";

import { useState } from "react";
import Image from "next/image";
import "./signup.css";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
    nationalId: "",
    government: "",
    city: "",
    location: "",
    preferredLocation: "",
    preferredBudget: "",
    preferredServiceType: "",
    educationalLevel: "",
    dob: "",
    gender: "",
    file1: null,
    file2: null,
    socialMediaLinks: "",
    description: "",
    website: "",
  });

  const router = useRouter();

  const roles = [
    { name: "Parent", img: "/images/parent.png" },
    { name: "School", img: "/images/school.png" },
    { name: "Clinic", img: "/images/clinic.png" },
    { name: "Admin", img: "/images/admin.png" },
    { name: "Sport", img: "/images/sport.png" },
  ];

  const roleFields = {
    Parent: [
      { name: "name", placeholder: "Child Name", type: "text" },
      { name: "phone", placeholder: "Phone", type: "text" },
      { name: "nationalId", placeholder: "National ID", type: "text" },
      { name: "email", placeholder: "Email", type: "email" },
      { name: "password", placeholder: "Password", type: "password" },
      { name: "username", placeholder: "Username", type: "text" },
      { name: "government", placeholder: "Government", type: "text" },
      { name: "city", placeholder: "City", type: "text" },
      { name: "location", placeholder: "Location", type: "text" },
      { name: "preferredLocation", placeholder: "Preferred Location", type: "text" },
      { name: "preferredBudget", placeholder: "Preferred Budget", type: "text" },
      { name: "preferredServiceType", placeholder: "Preferred Service Type", type: "text" },
      { name: "educationalLevel", placeholder: "Educational Level", type: "text" },
      { name: "dob", placeholder: "Date of Birth", type: "date" },
      { name: "gender", placeholder: "Gender", type: "select", options: ["Male", "Female"] },
      { name: "file1", placeholder: "Upload Document 1", type: "file" },
      { name: "file2", placeholder: "Upload Document 2", type: "file" },
    ],
    School: [
      { name: "name", placeholder: "School Name", type: "text" },
      { name: "categoryOfSchool", placeholder: "Category of School", type: "text" },
      { name: "curriculumType", placeholder: "Curriculum Type", type: "text" },
      { name: "classCapacity", placeholder: "Class Capacity", type: "number" },
      { name: "registrationFees", placeholder: "Registration Fees", type: "number" },
      { name: "annualFees", placeholder: "Annual Fees", type: "number" },
      { name: "location", placeholder: "Location", type: "text" },
      { name: "city", placeholder: "City", type: "text" },
      { name: "government", placeholder: "Government", type: "text" },
      { name: "phone", placeholder: "Phone", type: "text" },
      { name: "email", placeholder: "Email", type: "email" },
      { name: "educationalLevel", placeholder: "Educational Level", type: "text" },
      { name: "admissionDetails", placeholder: "Admission Details", type: "text" },
      { name: "historyInfo", placeholder: "History Info", type: "text" },
      { name: "shadowAvailability", placeholder: "Shadow Availability", type: "select", options: ["Yes", "No"] },
      { name: "specialType", placeholder: "Special Type", type: "text" },
      { name: "teacherTrainingStatus", placeholder: "Teacher Training Status", type: "text" },
      { name: "certificationsAvailability", placeholder: "Certifications Availability", type: "select", options: ["Yes", "No"] },
      { name: "socialMediaLinks", placeholder: "Social Media Links", type: "text" },
      { name: "website", placeholder: "Website", type: "text" },
      { name: "password", placeholder: "Password", type: "password" },
    ],
    Clinic: [
      { name: "name", placeholder: "Clinic Name", type: "text" },
      { name: "clinicType", placeholder: "Clinic Type", type: "text" },
      { name: "specializedTherapists", placeholder: "Specialized Therapists", type: "number" },
      { name: "email", placeholder: "Email", type: "email" },
      { name: "phone", placeholder: "Phone", type: "text" },
      { name: "location", placeholder: "Location", type: "text" },
      { name: "workingHours", placeholder: "Working Hours and Days", type: "text" },
      { name: "sessionPriceRange", placeholder: "Session Price Range", type: "text" },
      { name: "certificationsAvailability", placeholder: "Certifications Availability", type: "select", options: ["Yes", "No"] },
      { name: "specializationType", placeholder: "Specialization Type", type: "text" },
      { name: "slidingEquipments", placeholder: "Sliding Equipments", type: "select", options: ["Yes", "No"] },
      { name: "password", placeholder: "Password", type: "password" },
    ],
    Sport: [
      { name: "name", placeholder: "Sport Center Name", type: "text" },
      { name: "sportCenterType", placeholder: "Sport Center Type", type: "text" },
      { name: "location", placeholder: "Location", type: "text" },
      { name: "phone", placeholder: "Phone", type: "text" },
      { name: "email", placeholder: "Email", type: "email" },
      { name: "workingHours", placeholder: "Working Days and Hours", type: "text" },
      { name: "age", placeholder: "Age", type: "number" },
      { name: "staffQualifications", placeholder: "Staff Qualifications", type: "text" },
      { name: "coachCertifications", placeholder: "Coach Certifications", type: "text" },
      { name: "sportsTypeOffered", placeholder: "Sports Type Offered", type: "text" },
      { name: "privateSessions", placeholder: "Private Sessions or Group", type: "select", options: ["Private", "Group"] },
      { name: "specialCoachAvailability", placeholder: "Special Coach Availability", type: "select", options: ["Yes", "No"] },
      { name: "adaptiveEquipments", placeholder: "Adaptive Equipments", type: "select", options: ["Yes", "No"] },
      { name: "socialMediaLinks", placeholder: "Social Media Links", type: "text" },
      { name: "supportedConditions", placeholder: "Supported Conditions", type: "text" },
      { name: "description", placeholder: "Details", type: "text" },
      { name: "moreInfo", placeholder: "More Info", type: "text" },
      { name: "sessionPriceMin", placeholder: "Session Price Min", type: "number" },
      { name: "sessionPriceMax", placeholder: "Session Price Max", type: "number" },
      { name: "password", placeholder: "Password", type: "password" },
    ],
  };

  const getFieldGroups = (role) => {
    const fields = roleFields[role] || [];
    const groups = [];
    for (let i = 0; i < fields.length; i += 6) {
      groups.push(fields.slice(i, i + 6));
    }
    return groups;
  };

  const fieldGroups = getFieldGroups(role);
  const totalSteps = 1 + fieldGroups.length + 1; // 1 for role, groups, 1 for submit

  const back = () => setStep((prev) => prev - 1);

  const handleSelect = (r) => {
    if (r === "Admin") {
      alert("Admin cannot signup. Redirecting to login.");
      router.push("/login");
      return;
    }
    setRole(r);
    setTimeout(() => setStep(2), 200);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      dataToSend.append("role", role);

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Signup failed");
      }

      alert("Signup successful!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Make sure backend is running.");
    }
  };

  const renderField = (field) => {
    const { name, placeholder, type, options } = field;
    const value = formData[name];

    if (type === "select") {
      return (
        <div key={name} className="input-group">
          <select className='radio-gender-btn' name={name} value={value} onChange={handleChange}>
            <option value="">Select {placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (type === "file") {
      return (
        <div key={name} className="input-group">
          <input type="file" name={name} onChange={handleChange} />
        </div>
      );
    } else {
      return (
        <div key={name} className="input-group">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
          />
        </div>
      );
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        {/* LEFT SIDE */}
        <div className="left">
          <h1>Sign-up</h1>
          <p>Follow the steps to save your data</p>

          <div className="steps">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`circle ${step === s ? "active" : ""} ${
                  step > s ? "done" : ""
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="role-selection">
              <h2>Select Role</h2>

              <div className="roles">
                {roles.map((r) => (
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

          {/* FORM STEPS */}
          {step > 1 && step < totalSteps && (
            <div className="form-step">
              <h2>{role} Details - Step {step - 1}</h2>

              {fieldGroups[step - 2].map(renderField)}

              <div className="btns">
                <button onClick={back}>Back</button>
                <button onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* SUBMIT STEP */}
          {step === totalSteps && (
            <div className="success-box">
              <div className="check-circle">✓</div>
              <h3 className="subtitle">Data Recorded Successfully</h3>
              <p className="subtitle">Click below to finish</p>

              <button onClick={handleSubmit}>Submit & Go to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
