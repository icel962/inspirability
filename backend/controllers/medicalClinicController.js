const db = require("../db/db");

const CLINIC_COLUMNS = `
    m.clinic_id,
    m.clinic_name,
    m.clinic_type,
    m.specialized_therapists,
    m.email,
    m.phone_number,
    m.location,
    m.working_hours_and_days,
    m.session_price_range,
    m.certifications_availability,
    m.specialization_type,
    m.sliding_equipments,
    m.age,
    m.private_sessions_or_group,
    m.details,
    m.staff_qualifications,
    m.more_info,
    m.user_id,
    u.image`;

// Get all medical clinics
exports.getAllMedicalClinics = (req, res) => {
  const query = `
  SELECT ${CLINIC_COLUMNS}
  FROM medical_clinic m
  JOIN users u ON m.user_id = u.user_id
  WHERE u.approval_status = 'approved'
  ORDER BY m.clinic_id ASC
`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("MEDICAL CLINIC FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    console.log("Provider order (clinics):", result.map((r) => r.clinic_id));
    res.json(result);
  });
};

// Get a single medical clinic by ID
exports.getMedicalClinicById = (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT ${CLINIC_COLUMNS}
  FROM medical_clinic m
  JOIN users u ON m.user_id = u.user_id
  WHERE m.clinic_id = ?
    AND u.approval_status = 'approved'
`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("MEDICAL CLINIC FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length === 0)
      return res.status(404).json({ message: "Medical clinic not found" });

    console.log("Provider ID (clinic):", id, "image:", result[0].image);
    res.json(result[0]);
  });
};
