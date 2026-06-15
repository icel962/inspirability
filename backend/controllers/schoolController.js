const db = require("../db/db");

// Get all schools
exports.getSchools = (req, res) => {
  // NOTE: do NOT join media here — the media table JOIN produced one row per
  // media file, which duplicated school cards every time a provider uploaded
  // images. Media is fetched separately via GET /api/media/school/:id.
  const query = `
    SELECT
      s.*,
      u.image
    FROM school s
    JOIN users u ON s.user_id = u.user_id
    WHERE u.approval_status = 'approved'
    ORDER BY s.school_id ASC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("SCHOOL FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    console.log("Provider order (schools):", result.map((r) => r.school_id));
    res.json(result);
  });
};

// Get a single school by ID
exports.getSchoolById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      s.*,
      u.image
    FROM school s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.school_id = ?
      AND u.approval_status = 'approved'
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("SCHOOL BY ID FETCH ERROR:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (result.length === 0)
      return res.status(404).json({ message: "School not found" });

    console.log("Provider ID (school):", id, "image:", result[0].image);
    res.json(result[0]);
  });
};
