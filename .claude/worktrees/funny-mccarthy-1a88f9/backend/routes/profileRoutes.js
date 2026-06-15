const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { authenticate } = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

// storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ==============================
// GET PROFILE (USER + ROLE DATA)
// ==============================
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    // GET USER INFO
    const [userRows] = await db.promise().query(
      "SELECT user_id, email, role FROM users WHERE user_id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // ROLE TABLE SELECT
    let tableName = "";

    switch (role) {
      case "parent":
        tableName = "parent";
        break;
      case "school":
        tableName = "school";
        break;
      case "clinic":
      case "medical":
        tableName = "medical_clinic";
        break;
      case "sport":
        tableName = "sport_center";
        break;
      case "admin":
        tableName = "admin";
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    // GET PROFILE DATA
    let profileQuery = "";

if (role === "parent") {
  profileQuery = `
    SELECT p.*, u.email
    FROM parent p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ?
  `;
} else {
  profileQuery = `
   SELECT t.*, u.email, u.image
FROM ${tableName} t
JOIN users u ON t.user_id = u.user_id
WHERE t.user_id = ?
  `;
}

const [profileRows] = await db.promise().query(profileQuery, [userId]);

    if (profileRows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      user,
      role,
      profile: profileRows[0],
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/profile/update", authenticate, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const role = req.user.role.toLowerCase();
    const data = req.body;

    let table = "";

    switch (role) {
      case "parent":
        table = "parent";
        break;
      case "school":
        table = "school";
        break;
      case "sport":
        table = "sport_center";
        break;
      case "clinic":
      case "medical":
        table = "medical_clinic";
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    delete data.user_id;

    const allowedFields = {
      parent: ["name", "government", "city", "tel_no"],
      school: [
  "school_name",
  "city",
  "government",
  "tel_no",
  "educational_level",
  "special_type",
  "admission_details",
  "history_info",
],
      clinic: [
  "clinic_name",
  "clinic_type",
  "email",
  "phone_number",
  "location",
  "working_hours_and_days",
  "session_price_range",
  "certifications_availability",
  "specialization_type"
],

      medical: [
    "clinic_name",
    "clinic_type",
    "email",
    "phone_number",
    "location",
    "working_hours_and_days",
    "session_price_range",
    "certifications_availability",
    "specialization_type",
  ],
      sport: [
  "sport_center_name",
  "sport_center_type",
  "location",
  "phone_number",
  "email_address",
  "working_days_and_hours",
  "age",
  "staff_qualifications",
  "coach_certifications",
  "sports_type_offered",
  "private_sessions_or_group",
  "special_coach_availability",
  "adaptive_equipments",
  "social_media_links",
  "supported_conditions",
  "details",
  "more_info",
  "session_price_min",
  "session_price_max",
],
    };

const validFields = allowedFields[role] || [];
const filteredKeys = Object.keys(data).filter(
  (key) =>
    validFields.includes(key) &&
    data[key] !== null &&
    data[key] !== undefined &&
    data[key] !== ""
);

    if (filteredKeys.length === 0) {
      return res.status(400).json({ message: "No valid fields" });
    }

    const fields = filteredKeys.map((key) => `${key} = ?`).join(", ");
    const values = filteredKeys.map((key) => data[key]);

    const [result] = await db.promise().query(
      `UPDATE ${table} SET ${fields} WHERE user_id = ?`,
      [...values, userId]
    );

    console.log("UPDATED ROWS:", result.affectedRows);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ================= UPLOAD IMAGE =================
router.post(
  "/profile/upload-image",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const fileName = req.file.filename;

      // 🔥 خزّن في users مش في role table
      await db.promise().query(
        "UPDATE users SET image = ? WHERE user_id = ?",
        [fileName, userId]
      );

      res.json({ image: fileName });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;