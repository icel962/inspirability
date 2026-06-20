const db = require("../db/db");

// Get all medical clinics
exports.getAllMedicalClinics = (req, res) => {
  const query = `
    SELECT 
      clinic_id,
      clinic_name,
      clinic_type,
      specialized_therapists,
      email,
      phone_number,
      location,
      working_hours_and_days,
      session_price_range,
      certifications_availability,
      specialization_type,
      sliding_equipments,
      user_id
    FROM medical_clinic
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("MEDICAL CLINIC FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.json(result);
  });
};

// Get a single medical clinic by ID
exports.getMedicalClinicById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      clinic_id,
      clinic_name,
      clinic_type,
      specialized_therapists,
      email,
      phone_number,
      location,
      working_hours_and_days,
      session_price_range,
      certifications_availability,
      specialization_type,
      sliding_equipments,
      user_id
    FROM medical_clinic
    WHERE clinic_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("MEDICAL CLINIC FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Medical clinic not found" });
    }

    res.json(result[0]);
  });
};
