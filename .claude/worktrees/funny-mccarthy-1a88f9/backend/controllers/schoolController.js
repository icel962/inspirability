// controllers/schoolController.js
const db = require("../db/db");

// Get all schools with image
exports.getSchools = (req, res) => {
  const query = `
    SELECT 
      s.*,
      m.media_id,
      m.file_name,
      m.media_type,
      m.file_blob
    FROM school s
    LEFT JOIN media m 
      ON s.school_id = m.entity_id 
      AND m.entity_type = 'school'
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);

    const schools = result.map((row) => {
      let imageBase64 = null;
      if (row.file_blob) {
        imageBase64 = `data:image/png;base64,${row.file_blob.toString("base64")}`;
      }
      return { ...row, school_image: imageBase64 };
    });

    res.json(schools);
  });
};

// Get a single school by ID
exports.getSchoolById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.*,
      m.media_id,
      m.file_name,
      m.media_type,
      m.file_blob
    FROM school s
    LEFT JOIN media m 
      ON s.school_id = m.entity_id 
      AND m.entity_type = 'school'
    WHERE s.school_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "School not found" });

    const school = result[0];
    let imageBase64 = null;
    if (school.file_blob) {
      imageBase64 = `data:image/png;base64,${school.file_blob.toString("base64")}`;
    }

    res.json({ ...school, school_image: imageBase64 });
  });
};
