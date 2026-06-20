const db = require("../db/db");

// ==============================
// GET PROFILE
// ==============================
exports.getParentInfo = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT p.*, u.email 
    FROM parent p 
    JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result[0]);
  });
};

// ==============================
// UPDATE PROFILE
// ==============================
exports.updateParentInfo = (req, res) => {
  const userId = req.user.id;

  const {
    name,
    tel_no,
    government,
    city,
    DOB_child,
    gender_child,
    education_level_child,
  } = req.body;

  const query = `
    UPDATE parent SET 
      name = ?, 
      tel_no = ?, 
      government = ?, 
      city = ?, 
      DOB_child = ?, 
      gender_child = ?, 
      education_level_child = ?
    WHERE user_id = ?
  `;

  db.query(
    query,
    [
      name,
      tel_no,
      government,
      city,
      DOB_child,
      gender_child,
      education_level_child,
      userId,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "database error" });
      }

      res.json({ message: "Profile updated successfully" });
    },
  );
};
