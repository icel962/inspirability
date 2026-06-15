const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { authenticate } = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e6) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// GET PROFILE
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    const [userRows] = await db.promise().query(
      "SELECT user_id, email, role FROM users WHERE user_id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    let tableName = "";
    switch (role) {
      case "parent":   tableName = "parent"; break;
      case "school":   tableName = "school"; break;
      case "clinic":
      case "medical":  tableName = "medical_clinic"; break;
      case "sport":    tableName = "sport_center"; break;
      case "admin":    tableName = "admin"; break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    let profileQuery = "";
    if (role === "parent") {
      profileQuery = "SELECT p.*, u.email, u.image FROM parent p JOIN users u ON p.user_id = u.user_id WHERE p.user_id = ?";
    } else {
      profileQuery = "SELECT t.*, u.email, u.image FROM " + tableName + " t JOIN users u ON t.user_id = u.user_id WHERE t.user_id = ?";
    }

    const [profileRows] = await db.promise().query(profileQuery, [userId]);

    if (profileRows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ user, role, profile: profileRows[0] });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE
router.put("/profile/update", authenticate, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const role = req.user.role.toLowerCase();
    const data = req.body;

    let table = "";
    switch (role) {
      case "parent":  table = "parent"; break;
      case "school":  table = "school"; break;
      case "sport":   table = "sport_center"; break;
      case "clinic":
      case "medical": table = "medical_clinic"; break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    delete data.user_id;

    const allowedFields = {
      parent: [
        "name", "username", "government", "city", "tel_no",
        "education_level_child", "DOB_child", "gender_child",
        "preferred_location", "preferred_budget", "preferred_service_type",
      ],
      school: [
        "school_name", "city", "government", "tel_no",
        "educational_level", "special_type", "admission_details", "history_info",
        "category_of_school", "curriculum_type", "class_capacity",
        "annual_fees", "registration_fees", "location",
        "social_media_links",
      ],
      clinic: [
        "clinic_name", "clinic_type", "email", "phone_number", "location",
        "working_hours_and_days", "session_price_range",
        "certifications_availability", "specialization_type", "specialized_therapists",
        "sliding_equipments",
        "age", "private_sessions_or_group", "details", "staff_qualifications", "more_info",
      ],
      medical: [
        "clinic_name", "clinic_type", "email", "phone_number", "location",
        "working_hours_and_days", "session_price_range",
        "certifications_availability", "specialization_type", "specialized_therapists",
        "sliding_equipments",
        "age", "private_sessions_or_group", "details", "staff_qualifications", "more_info",
      ],
      sport: [
        "sport_center_name", "sport_center_type", "location",
        "phone_number", "email_address", "working_days_and_hours",
        "age", "staff_qualifications", "coach_certifications",
        "sports_type_offered", "private_sessions_or_group",
        "special_coach_availability", "adaptive_equipments",
        "social_media_links", "supported_conditions",
        "details", "more_info", "session_price_min", "session_price_max",
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

    const fields = filteredKeys.map((key) => key + " = ?").join(", ");
    const values = filteredKeys.map((key) => data[key]);

    const [result] = await db.promise().query(
      "UPDATE " + table + " SET " + fields + " WHERE user_id = ?",
      [...values, userId]
    );

    console.log("UPDATED ROWS:", result.affectedRows);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// UPLOAD PROFILE IMAGE
function runMulterSingle(field) {
  var handler = upload.single(field);
  return function(req, res, next) {
    handler(req, res, function(err) {
      if (!err) return next();
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 20 MB." });
      }
      console.error("MULTER SINGLE ERROR:", err);
      return res.status(400).json({ message: err.message || "File upload error." });
    });
  };
}

router.post(
  "/profile/upload-image",
  authenticate,
  runMulterSingle("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      if (!req.file) {
        return res.status(400).json({ message: "No image file received." });
      }
      const fileName = req.file.filename;
      console.log("Provider logo:", fileName, "for user:", userId);

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

// MEDIA UPLOAD
function runMulterArray(field, max) {
  var handler = upload.array(field, max);
  return function(req, res, next) {
    handler(req, res, function(err) {
      if (!err) return next();
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 20 MB." });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ message: "Too many files. Maximum is " + max + " files at once." });
      }
      console.error("MULTER ERROR:", err);
      return res.status(400).json({ message: err.message || "File upload error." });
    });
  };
}

router.post("/media/upload", authenticate, runMulterArray("media", 10), async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files received. Make sure you are sending files with the field name 'media'." });
    }

    let table, idCol, entityType;
    switch (role) {
      case "school":
        table = "school"; idCol = "school_id"; entityType = "school"; break;
      case "clinic":
      case "medical":
        table = "medical_clinic"; idCol = "clinic_id"; entityType = "clinic"; break;
      case "sport":
        table = "sport_center"; idCol = "sport_center_id"; entityType = "sport"; break;
      default:
        return res.status(403).json({ message: "Only school, clinic, and sport providers can upload media." });
    }

    const [rows] = await db.promise().query(
      "SELECT " + idCol + " FROM " + table + " WHERE user_id = ?", [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Provider profile not found. Please complete your registration." });
    }
    const entityId = rows[0][idCol];

    console.log("Uploading media for provider:", entityId, "type:", entityType, "files:", req.files.length);

    const inserted = [];
    for (const file of req.files) {
      const mediaType = file.mimetype.startsWith("video")
        ? "video"
        : file.mimetype === "application/pdf"
        ? "pdf"
        : "image";
      const [result] = await db.promise().query(
        "INSERT INTO media (file_name, media_type, entity_id, entity_type) VALUES (?, ?, ?, ?)",
        [file.filename, mediaType, entityId, entityType]
      );
      inserted.push({ media_id: result.insertId, file_name: file.filename, media_type: mediaType });
      console.log("Upload response:", { media_id: result.insertId, file_name: file.filename, media_type: mediaType });
    }

    res.json({ message: "Upload successful", files: inserted });
  } catch (err) {
    console.error("MEDIA UPLOAD ERROR:", err.message, err.stack);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
});

// MEDIA GET (public)
router.get("/media/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const [rows] = await db.promise().query(
      "SELECT media_id, file_name, media_type FROM media WHERE entity_type = ? AND entity_id = ? ORDER BY media_id DESC",
      [entityType, Number(entityId)]
    );
    res.json(rows);
  } catch (err) {
    console.error("MEDIA FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

// MEDIA DELETE (provider auth)
router.delete("/media/:mediaId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();
    const mediaId = Number(req.params.mediaId);

    const [mediaRows] = await db.promise().query(
      "SELECT * FROM media WHERE media_id = ?", [mediaId]
    );
    if (mediaRows.length === 0) return res.status(404).json({ message: "Media not found" });
    const media = mediaRows[0];

    let table, idCol;
    switch (role) {
      case "school":  table = "school"; idCol = "school_id"; break;
      case "clinic":
      case "medical": table = "medical_clinic"; idCol = "clinic_id"; break;
      case "sport":   table = "sport_center"; idCol = "sport_center_id"; break;
      default: return res.status(403).json({ message: "Forbidden" });
    }

    const [provRows] = await db.promise().query(
      "SELECT " + idCol + " FROM " + table + " WHERE user_id = ?", [userId]
    );
    if (provRows.length === 0 || provRows[0][idCol] !== media.entity_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db.promise().query("DELETE FROM media WHERE media_id = ?", [mediaId]);

    const filePath = path.join(__dirname, "../uploads", media.file_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("MEDIA DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
