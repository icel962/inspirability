const db = require("../db/db");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const JWT_SECRET = "your_special_secret_key_2026";

function insertSignupMedia(files, entityId, entityType) {
  const mediaFiles = files.filter((f) => f.fieldname !== "logo");
  mediaFiles.forEach((f) => {
    const mediaType = f.mimetype.startsWith("video")
      ? "video"
      : f.mimetype === "application/pdf"
      ? "pdf"
      : "image";
    db.query(
      "INSERT INTO media (file_name, media_type, entity_id, entity_type) VALUES (?, ?, ?, ?)",
      [f.filename, mediaType, entityId, entityType],
      (err) => { if (err) console.error("Media insert error:", err.message); }
    );
  });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

// ==============================
// AUTH MIDDLEWARE
// ==============================
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = { id: verified.id, role: verified.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// ==============================
// SIGNUP
// ==============================
exports.signup = [
  upload.any(),
  async (req, res) => {
    try {
      const data = req.body;
      const role = data.role?.toLowerCase();

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      // ================= ADMIN =================
if (role === "admin") {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  db.query(
    "INSERT INTO users (email, password, role, approval_status, payment_status) VALUES (?, ?, ?, 'approved', 'approved')",
    [data.email, hashedPassword, role],
    (err, result) => {
      if (err) {
        console.error("ADMIN INSERT ERROR:", err);
        return res.status(500).json(err);
      }

      return res.json({
        message: "Admin registered successfully",
        userId: result.insertId,
      });
    }
  );

  return; // important to stop further execution
}

let approvalStatus = "approved";
let paymentStatus = "approved";

// providers only
if (
  role === "school" ||
  role === "clinic" ||
  role === "sport"
) {
  approvalStatus = "pending";
  paymentStatus = "unpaid";
}
      const hashedPassword = await bcrypt.hash(data.password, 10);

      db.query(
  `INSERT INTO users 
  (email, password, role, approval_status, payment_status)
  VALUES (?, ?, ?, ?, ?)`,
  [
    data.email,
    hashedPassword,
    role,
    approvalStatus,
    paymentStatus
  ],
        (err, result) => {
          if (err) {
            console.error("USER INSERT ERROR:", err);
            return res.status(500).json(err);
          }

          const userId = result.insertId;

          const files = req.files || [];
          const fileNames =
            files.map((file) => file.filename).join(",") || null;

          // Sync the uploaded logo to users.image so it renders everywhere
          const logoFile = files.find((f) => f.fieldname === "logo");
          if (logoFile) {
            db.query(
              "UPDATE users SET image = ? WHERE user_id = ?",
              [logoFile.filename, userId],
              () => {}
            );
          }

          // ================= SCHOOL =================
          if (role === "school") {
            const sql = `
              INSERT INTO school (
                school_name,
                category_of_school,
                curriculum_type,
                class_capacity,
                registration_fees,
                annual_fees,
                location,
                city,
                government,
                tel_no,
                email,
                educational_level,
                admission_details,
                history_info,
                shadow_availability,
                special_type,
                teacher_training_status,
                certifications_availability,
                social_media_links,
                school_logo,
                user_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              data.name || null,
              data.categoryOfSchool || null,
              data.curriculumType || null,
              data.classCapacity || null,
              data.registrationFees || null,
              data.annualFees || null,
              data.location || null,
              data.city || null,
              data.government || null,
              data.phone || null,
              data.email || null,
              data.educationalLevel || null,
              data.admissionDetails || null,
              data.historyInfo || null,
              data.shadowAvailability === "Yes" ? 1 : 0,
              data.specialType || null,
              data.teacherTrainingStatus || null,
              data.certificationsAvailability === "Yes" ? 1 : 0,
              data.socialMediaLinks || null,
              fileNames,
              userId,
            ];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("SCHOOL INSERT ERROR:", err);
                return res.status(500).json(err);
              }
              insertSignupMedia(files, result.insertId, "school");
              return res.json({ message: "School registered" });
            });
          }

          // ================= CLINIC =================
          else if (role === "clinic") {
            const sql = `
              INSERT INTO medical_clinic (
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
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              data.name || null,
              data.clinicType || null,
              data.specializedTherapists || null,
              data.email || null,
              data.phone || null,
              data.location || null,
              data.workingHours || null,
              data.sessionPriceRange || null,
              data.certificationsAvailability === "Yes" ? 1 : 0,
              data.specializationType || null,
              data.slidingEquipments === "Yes" ? 1 : 0,
              userId,
            ];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("CLINIC INSERT ERROR:", err);
                return res.status(500).json(err);
              }
              insertSignupMedia(files, result.insertId, "clinic");
              return res.json({ message: "Clinic registered" });
            });
          }

          // ================= SPORT =================
          else if (role === "sport") {
            const sql = `
              INSERT INTO sport_center (
                sport_center_name,
                sport_center_type,
                location,
                phone_number,
                email_address,
                working_days_and_hours,
                age,
                staff_qualifications,
                coach_certifications,
                sports_type_offered,
                private_sessions_or_group,
                special_coach_availability,
                adaptive_equipments,
                social_media_links,
                supported_conditions,
                details,
                more_info,
                session_price_min,
                session_price_max,
                user_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              data.name || null,
              data.sportCenterType || null,
              data.location || null,
              data.phone || null,
              data.email || null,
              data.workingHours || null,
              data.age || null,
              data.staffQualifications || null,
              data.coachCertifications || null,
              data.sportsTypeOffered || null,
              data.privateSessions === "Private" ? 0 : 1,
              data.specialCoachAvailability === "Yes" ? 1 : 0,
              data.adaptiveEquipments === "Yes" ? 1 : 0,
              data.socialMediaLinks || null,
              data.supportedConditions || null,
              data.description || null,
              data.moreInfo || null,
              data.sessionPriceMin || null,
              data.sessionPriceMax || null,
              userId,
            ];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("SPORT INSERT ERROR:", err);
                return res.status(500).json(err);
              }
              insertSignupMedia(files, result.insertId, "sport");
              return res.json({ message: "Sport center registered" });
            });
          }

          // ================= PARENT =================
          else if (role === "parent") {
            const sql = `
              INSERT INTO parent (
                name, tel_no, national_id, government, city, location,
                username, document_upload,
                education_level_child, DOB_child, gender_child,
                preferred_location, preferred_budget, preferred_service_type,
                user_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              data.name,
              data.phone,
              data.nationalId,
              data.government,
              data.city,
              data.location,
              data.username,
              fileNames,
              data.educationalLevel,
              data.dob,
              data.gender,
              data.preferredLocation,
              data.preferredBudget,
              data.preferredServiceType,
              userId,
            ];

            db.query(sql, values, (err) => {
              if (err) {
                console.error("PARENT INSERT ERROR:", err);
                return res.status(500).json(err);
              }
              return res.json({ message: "Parent registered" });
            });
          }

        }
      );
    } catch (err) {
      console.error("GLOBAL SIGNUP ERROR:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
];

// ==============================
// LOGIN
// ==============================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      const providerRoles = ["school", "clinic", "sport"];

      // Only block service providers — parents and admins log in freely
      if (providerRoles.includes(user.role) && user.approval_status === "pending") {
        return res.status(403).json({
          message: "Your account is under review by admin",
        });
      }

      if (providerRoles.includes(user.role) && user.approval_status === "rejected") {
        return res.status(403).json({
          message: "Your account has been rejected",
        });
      }

      if (providerRoles.includes(user.role) && user.payment_status === "rejected") {
        return res.status(403).json({
          message: "Your payment was rejected",
          paymentRejected: true,
        });
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      const isProvider = providerRoles.includes(user.role);

      console.log("Logged in user:", user.email);
      console.log("User role:", user.role);
      console.log("Approval status:", user.approval_status);
      const shouldShowReviewModal = isProvider && user.approval_status === "pending";
      console.log("Should show review modal:", shouldShowReviewModal);

      res.json({
        message: "Login successful",
        token,

        user: {
          ...user,

          // Only show approval notification to providers; treat NULL column as unseen (=== 0)
          showApprovalMessage:
            isProvider &&
            user.approval_status === "approved" &&
            user.approval_message_seen === 0,

          // Only show payment notification to providers
          showPaymentMessage:
            isProvider &&
            user.payment_status === "approved" &&
            user.payment_message_seen === 0,
        },
      });
    },
  );
};



exports.sendPaymentRequest = (req, res) => {
  const user_id = req.user.id;
  const { plan, amount, duration } = req.body;

  db.query(
    `UPDATE users
     SET payment_status   = 'pending',
         payment_plan     = ?,
         payment_amount   = ?,
         payment_duration = ?
     WHERE user_id = ?`,
    [plan || null, amount || null, duration || null, user_id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Payment request sent" });
    }
  );
};

exports.hideApprovalMessage = (req, res) => {

  db.query(
    `UPDATE users
     SET approval_message_seen = true
     WHERE user_id = ?`,
    [req.user.id],
    (err) => {

      if (err)
        return res.status(500).json(err);

      res.json({
        message: "done",
      });
    }
  );
};

exports.hidePaymentMessage = (req, res) => {

  db.query(
    `UPDATE users
     SET payment_message_seen = true
     WHERE user_id = ?`,
    [req.user.id],
    (err) => {

      if (err)
        return res.status(500).json(err);

      res.json({
        message: "done",
      });
    }
  );
};
