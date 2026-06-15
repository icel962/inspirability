"use client";
import "./admin.css";
import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Line } from "react-chartjs-2";
import { initContacts, loadContacts, saveContacts, getImgSrc } from "../utils/contactsStorage";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const CATEGORY_TO_SPECIALTY = {
  "Private Teacher": "education",
  "Private Doctor":  "medical",
  "Private Trainer": "sports",
  "Therapist":       "therapy",
  "Doctor":          "medical",
  "Teacher":         "education",
  "Coach":           "sports",
};

const EMPTY_FORM = {
  name:           "",
  category:       "",
  specialization: "",
  phone:          "",
  email:          "",
  location:       "",
  availability:   "",
  status:         "Available",
  budgetValue:    "",
  review:         "",
  image:          "",
  description:    "",
};

function validateAddForm(form) {
  if (!form.name.trim() || form.name.trim().length < 2)
    return "Full Name is required (at least 2 characters).";
  if (!form.category)
    return "Category is required.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    return "Enter a valid email address (e.g. name@example.com).";
  if (form.phone.trim()) {
    let p = form.phone.replace(/[\s\-\(\)]/g, "");
    if (p.startsWith("+20")) p = "0" + p.slice(3);
    if (p.startsWith("0020")) p = "0" + p.slice(4);
    if (!/^01[0125]\d{8}$/.test(p))
      return "Enter a valid Egyptian mobile number (e.g. 0100 000 0000).";
  }
  if (form.review && (isNaN(Number(form.review)) || Number(form.review) < 0 || Number(form.review) > 5))
    return "Rating must be between 0 and 5.";
  return null;
}

const BASE_URL = "http://localhost:5000";

const STATS_DEFAULT = {
  totalUsers: null,
  totalProviders: null,
  newThisMonth: null,
  totalVisits: null,
  chartData: null,
  growthSnapshot: null,
  recentActivity: [],
};

function fmt(n) {
  if (n === null) return "…";
  return Number(n).toLocaleString();
}

function growthPill(pct) {
  if (pct === null || pct === undefined) return null;
  const up = pct >= 0;
  return (
    <span className={`trend-pill ${up ? "is-up" : "is-down"}`}>
      {up ? "+" : ""}{pct}% from last month
    </span>
  );
}

export default function Dashboard() {
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [allContacts,   setAllContacts]   = useState([]);
  const [formError,     setFormError]     = useState("");
  const [imagePreview,  setImagePreview]  = useState(null);

  // filters
  const [searchQuery,      setSearchQuery]      = useState("");
  const [filterCategory,   setFilterCategory]   = useState("all");
  const [filterSpecialty,  setFilterSpecialty]  = useState("all");
  const [filterStatus,     setFilterStatus]     = useState("all");

  // edit modal
  const [editingId,        setEditingId]        = useState(null);
  const [editForm,         setEditForm]         = useState(null);
  const [editFormError,    setEditFormError]    = useState("");
  const [editImagePreview, setEditImagePreview] = useState(null);

  // analytics
  const [stats, setStats] = useState(STATS_DEFAULT);

  useEffect(() => {
    initContacts();
    const stored = loadContacts();
    setAllContacts(stored);

    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return null;
        }
        if (!r.ok) throw new Error(`Stats API returned ${r.status}`);
        return r.json();
      })
      .then((data) => { if (data) setStats(data); })
      .catch((e) => console.error("Stats fetch error:", e));
  }, []);

  // ── filtered contacts (live search + dropdowns) ─────────────────────────
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allContacts.filter((c) => {
      if (q && ![c.name, c.email, c.phone, c.specialization, c.role, c.location]
        .filter(Boolean).join(" ").toLowerCase().includes(q)) return false;
      if (filterCategory  !== "all" && c.category         !== filterCategory)  return false;
      if (filterSpecialty !== "all" && c.specialty         !== filterSpecialty) return false;
      if (filterStatus    !== "all" && c.status?.toLowerCase() !== filterStatus.toLowerCase()) return false;
      return true;
    });
  }, [allContacts, searchQuery, filterCategory, filterSpecialty, filterStatus]);

  // ── Add contact ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, image: ev.target.result }));
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddContact = () => {
    const err = validateAddForm(form);
    if (err) { setFormError(err); return; }

    const newContact = {
      id:             `dynamic-${Date.now()}`,
      name:           form.name.trim(),
      role:           form.specialization.trim() || form.category,
      category:       form.category,
      specialty:      CATEGORY_TO_SPECIALTY[form.category] || "education",
      specialization: form.specialization.trim(),
      phone:          form.phone.trim(),
      email:          form.email.trim(),
      location:       form.location.trim(),
      availability:   form.availability.trim(),
      status:         form.status || "Available",
      budgetValue:    form.budgetValue.trim(),
      budgetLabel:    form.budgetValue.trim() ? "Custom" : "",
      review:         form.review ? Number(form.review) : 0,
      reviewLabel:    form.review ? `${form.review} rating` : "",
      reviewsCount:   0,
      image:          form.image || "images/1.jpg",
      description:    form.description.trim(),
    };

    console.log("New contact added:", newContact);

    const updated = [...allContacts, newContact];
    saveContacts(updated);
    setAllContacts(updated);
    setForm(EMPTY_FORM);
    setImagePreview(null);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteContact = (id) => {
    const deleted = allContacts.find((c) => c.id === id);
    console.log("Deleted contact:", deleted);
    const updated = allContacts.filter((c) => c.id !== id);
    saveContacts(updated);
    setAllContacts(updated);
  };

  // ── Edit modal ────────────────────────────────────────────────────────────
  const handleEditContact = (contact) => {
    setEditingId(contact.id);
    setEditForm({ ...contact });
    setEditImagePreview(null);
    setEditFormError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditForm((prev) => ({ ...prev, image: ev.target.result }));
      setEditImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editForm.name?.trim()) { setEditFormError("Name is required."); return; }
    setEditFormError("");
    const updated = allContacts.map((c) => (c.id === editingId ? { ...editForm } : c));
    console.log("Edited contact:", editForm);
    saveContacts(updated);
    setAllContacts(updated);
    setEditingId(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => { setEditingId(null); setEditForm(null); };

  return (
    <main className="dashboard-page">

      {/* EDIT MODAL */}
      {editingId && editForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", overflowY: "auto",
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "32px",
            width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <h3 style={{ margin: "0 0 6px", color: "#16227e", fontSize: "20px" }}>Edit Contact</h3>
            <p style={{ margin: "0 0 20px", color: "#666", fontSize: "13px" }}>
              Changes save to localStorage and appear immediately on the public Contacts page.
            </p>

            {editFormError && (
              <p style={{ color: "red", marginBottom: "12px", fontSize: "14px" }}>{editFormError}</p>
            )}

            <div className="form-grid">
              <div className="field-group">
                <label>Full Name <span style={{ color: "#d63b3b" }}>*</span></label>
                <input name="name" placeholder="e.g. Ahmed Mohamed" value={editForm.name || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Role / Title</label>
                <input name="role" placeholder="e.g. Speech Therapist" value={editForm.role || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Category</label>
                <select name="category" value={editForm.category || ""} onChange={handleEditChange}>
                  <option value="">Select category</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Coach">Coach</option>
                  <option value="Therapist">Therapist</option>
                  <option value="Private Teacher">Private Teacher</option>
                  <option value="Private Doctor">Private Doctor</option>
                  <option value="Private Trainer">Private Trainer</option>
                </select>
              </div>
              <div className="field-group">
                <label>Specialty</label>
                <select name="specialty" value={editForm.specialty || "education"} onChange={handleEditChange}>
                  <option value="medical">Medical</option>
                  <option value="education">Education</option>
                  <option value="sports">Sports</option>
                  <option value="therapy">Therapy</option>
                </select>
              </div>
              <div className="field-group">
                <label>Specialization Detail</label>
                <input name="specialization" placeholder="e.g. Autism support" value={editForm.specialization || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Phone</label>
                <input name="phone" placeholder="0100 000 0000" value={editForm.phone || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Email Address</label>
                <input name="email" placeholder="name@example.com" value={editForm.email || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Location</label>
                <input name="location" placeholder="e.g. Nasr City, Cairo" value={editForm.location || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Availability</label>
                <input name="availability" placeholder="e.g. Sun–Thu, 9AM–5PM" value={editForm.availability || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Status</label>
                <select name="status" value={editForm.status || "Available"} onChange={handleEditChange}>
                  <option value="Available">Available</option>
                  <option value="Active">Active</option>
                  <option value="Online">Online</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>
              <div className="field-group">
                <label>Budget</label>
                <input name="budgetValue" placeholder="e.g. EGP 500 / session" value={editForm.budgetValue || ""} onChange={handleEditChange} />
              </div>
              <div className="field-group">
                <label>Rating (0–5)</label>
                <input name="review" type="number" min="0" max="5" step="0.1" placeholder="4.8" value={editForm.review || ""} onChange={handleEditChange} />
              </div>

              {/* Photo */}
              <div className="field-group full" style={{ gap: "8px" }}>
                <label>Profile Photo</label>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img
                    src={editImagePreview || getImgSrc(editForm.image)}
                    alt="Preview"
                    style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd", flexShrink: 0 }}
                    onError={(e) => { e.target.src = "/images/1.jpg"; }}
                  />
                  <label className="file-upload-wrapper" style={{ flex: 1, cursor: "pointer" }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleEditImageChange} />
                    <span className="file-upload-btn">Upload Photo</span>
                    <span className="file-upload-name">
                      {editImagePreview ? "New photo selected" : "Click to change photo"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="field-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Short summary for parents viewing this contact…"
                  value={editForm.description || ""}
                  onChange={handleEditChange}
                  style={{ minHeight: "80px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={handleCancelEdit}
                style={{ background: "#f0f0f0", color: "#333", padding: "10px 22px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit} style={{ margin: 0 }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="admin-shell">
          <div className="hero-copy">
            <span className="eyebrow">Admin Panel</span>
            <h1>Admin Dashboard</h1>
            <p>Track monthly platform activity, monitor new parent engagement, and manage trusted contacts.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-card__label">Total Visitors</p>
              <h2 className="stat-card__value">{fmt(stats.totalVisits)}</h2>
              <p className="stat-card__meta">Unique daily sessions</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Total Registered Users</p>
              <h2 className="stat-card__value">{fmt(stats.totalUsers)}</h2>
              <p className="stat-card__meta">Parents &amp; providers</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Total Contact Listings</p>
              <h2 className="stat-card__value">{fmt(stats.totalProviders)}</h2>
              <p className="stat-card__meta">Schools, clinics &amp; sports</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">New This Month</p>
              <h2 className="stat-card__value">{fmt(stats.newThisMonth)}</h2>
              <p className="stat-card__meta">Registrations this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="dashboard-section">
        <div className="admin-shell">
          <div className="section-heading">
            <span className="section-kicker">Insights</span>
            <h2>Website analytics overview</h2>
            <p>Live data from the database — updates automatically.</p>
          </div>

          <div className="insights-layout">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Monthly performance</h3>
                  <p className="sub-text">Visitors, signups, and appointments across recent months.</p>
                </div>
                <div className="legend">
                  <span><i className="dot visitors"></i>Visitors</span>
                  <span><i className="dot signups"></i>Signups</span>
                  <span><i className="dot inquiries"></i>Appointments</span>
                </div>
              </div>
              <div className="chart-wrap">
                {stats.chartData ? (
                  <Line
                    data={{
                      labels: stats.chartData.labels,
                      datasets: [
                        { label: "Visitors",     data: stats.chartData.visits,       borderColor: "#16227e", tension: 0.4, fill: false },
                        { label: "Signups",      data: stats.chartData.signups,      borderColor: "#00a6c8", tension: 0.4, fill: false },
                        { label: "Appointments", data: stats.chartData.appointments, borderColor: "#8b5cf6", tension: 0.4, fill: false },
                      ]
                    }}
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { grid: { color: "#e5e7eb" }, beginAtZero: true }, x: { grid: { display: false } } }
                    }}
                  />
                ) : (
                  <p style={{ textAlign: "center", color: "#999", paddingTop: "60px" }}>Loading chart…</p>
                )}
              </div>
            </div>

            <div className="insights-support">
              <div className="panel">
                <h3>Growth snapshot</h3>
                <div className="trend-item">
                  <strong>Visitor growth</strong>
                  <p>{fmt(stats.growthSnapshot?.thisMonthVisits)} visitors this month</p>
                  {stats.growthSnapshot && growthPill(stats.growthSnapshot.visitGrowth)}
                </div>
                <div className="trend-item">
                  <strong>Signup growth</strong>
                  <p>{fmt(stats.growthSnapshot?.thisMonthSignups)} new users this month</p>
                  {stats.growthSnapshot && growthPill(stats.growthSnapshot.signupGrowth)}
                </div>
                <div className="trend-item">
                  <strong>Appointment growth</strong>
                  <p>{fmt(stats.growthSnapshot?.thisMonthAppointments)} appointments this month</p>
                  {stats.growthSnapshot && growthPill(stats.growthSnapshot.appointmentGrowth)}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Recent registrations</h3>
                    <p className="sub-text">Latest accounts created on the platform.</p>
                  </div>
                </div>
                <div className="activity-list">
                  {stats.recentActivity.length === 0 ? (
                    <p style={{ color: "#999", fontSize: "13px" }}>No recent registrations.</p>
                  ) : (
                    stats.recentActivity.map((u, i) => (
                      <div key={i} className="activity-item">
                        <strong>{u.email}</strong>
                        <p>{u.role.charAt(0).toUpperCase() + u.role.slice(1)} account registered</p>
                        <span className="date">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS SECTION */}
      <section className="dashboard-section dashboard-section--light">
        <div className="admin-shell">
          <div className="section-heading">
            <span className="section-kicker">CONTACTS</span>
            <h2>Manage parent resources</h2>
            <p>Add and maintain private teachers, trainers, and doctors in one place.</p>
          </div>

          <div className="management-layout">

            {/* LEFT — ADD FORM */}
            <div className="panel form-panel">
              <h3>Add New Contact</h3>
              <p className="sub-text" style={{ marginBottom: 16 }}>
                New entries are saved locally and appear immediately on the public Contacts page.
              </p>

              {formError && (
                <p style={{ color: "#d63b3b", marginBottom: "12px", fontSize: "13.5px", background: "rgba(214,59,59,0.07)", padding: "10px 12px", borderRadius: "10px" }}>
                  {formError}
                </p>
              )}

              <div className="form-grid">

                <div className="field-group">
                  <label>Full Name <span style={{ color: "#d63b3b" }}>*</span></label>
                  <input name="name" placeholder="e.g. Ahmed Mohamed" value={form.name} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Category <span style={{ color: "#d63b3b" }}>*</span></label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    <option value="Private Teacher">Private Teacher</option>
                    <option value="Private Doctor">Private Doctor</option>
                    <option value="Private Trainer">Private Trainer</option>
                    <option value="Therapist">Therapist</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Specialization</label>
                  <input name="specialization" placeholder="e.g. Speech therapy, math" value={form.specialization} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Phone Number</label>
                  <input name="phone" placeholder="0100 000 0000" value={form.phone} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Email Address</label>
                  <input name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Location</label>
                  <input name="location" placeholder="e.g. Nasr City, Cairo" value={form.location} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Availability</label>
                  <input name="availability" placeholder="e.g. Ages 4–12, home visits" value={form.availability} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Active">Active</option>
                    <option value="Online">Online</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Budget</label>
                  <input name="budgetValue" placeholder="e.g. EGP 450 / session" value={form.budgetValue} onChange={handleChange} />
                </div>

                <div className="field-group">
                  <label>Rating (0–5)</label>
                  <input name="review" type="number" min="0" max="5" step="0.1" placeholder="4.8" value={form.review} onChange={handleChange} />
                </div>

                {/* Profile photo */}
                <div className="field-group full">
                  <label>Profile Photo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "2px" }}>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview"
                        style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd", flexShrink: 0 }} />
                    )}
                    <label className="file-upload-wrapper" style={{ flex: 1, cursor: "pointer" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                      <span className="file-upload-btn">Upload Photo</span>
                      <span className="file-upload-name">
                        {imagePreview ? "Photo selected" : "Click to upload (optional)"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="field-group full">
                  <label>Description</label>
                  <textarea name="description" placeholder="Short summary for parents viewing this contact…" value={form.description} onChange={handleChange} />
                </div>

              </div>

              <button className="btn-primary" onClick={handleAddContact}>
                Add Contact
              </button>
            </div>

            {/* RIGHT — TABLE */}
            <div className="panel list-panel">
              <h3>Existing Contacts</h3>
              <p className="sub-text">
                {allContacts.length} total —{" "}
                {filteredContacts.length !== allContacts.length
                  ? `${filteredContacts.length} shown after filters`
                  : "all visible on the public Contacts page"}
              </p>

              {/* FILTERS */}
              <div className="filters-row">
                <input
                  placeholder="Search by name, email, phone…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Coach">Coach</option>
                  <option value="Therapist">Therapist</option>
                  <option value="Private Teacher">Private Teacher</option>
                  <option value="Private Doctor">Private Doctor</option>
                  <option value="Private Trainer">Private Trainer</option>
                </select>
                <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
                  <option value="all">All Specialties</option>
                  <option value="medical">Medical</option>
                  <option value="education">Education</option>
                  <option value="sports">Sports</option>
                  <option value="therapy">Therapy</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Active">Active</option>
                  <option value="Online">Online</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>

              <div className="table-wrap">
                <table className="contact-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>CATEGORY</th>
                      <th>SPECIALTY</th>
                      <th>CONTACT</th>
                      <th>AREA</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "#999", padding: "28px" }}>
                          {allContacts.length === 0 ? "Loading contacts…" : "No contacts match your filters."}
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="contact-title">
                              <img
                                src={getImgSrc(c.image)}
                                className="contact-avatar"
                                alt=""
                                onError={(e) => { e.target.src = "/images/1.jpg"; }}
                              />
                              <div>
                                <strong>{c.name}</strong>
                                {c.review > 0 && <div className="sub">{c.review} / 5 rating</div>}
                              </div>
                            </div>
                          </td>
                          <td>{c.category}</td>
                          <td>
                            <strong>{c.specialization || c.role}</strong>
                            {c.availability && <div className="sub">{c.availability}</div>}
                          </td>
                          <td>
                            {c.phone && <div>{c.phone}</div>}
                            {c.email && <div className="sub">{c.email}</div>}
                          </td>
                          <td>{c.location}</td>
                          <td>
                            <span className={`status ${c.status?.toLowerCase()}`}>{c.status}</span>
                          </td>
                          <td className="actions-cell">
                            <button className="btn edit" onClick={() => handleEditContact(c)}>Edit</button>
                            <button className="btn delete" onClick={() => handleDeleteContact(c.id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
