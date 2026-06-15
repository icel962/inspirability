require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/PaymentRouter.js");
const sportCenterRoutes = require("./routes/sportCenterRoutes");
const medicalClinicRoutes = require("./routes/medicalClinicRoutes");
const parentRoutes = require("./routes/parentRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", sportCenterRoutes);
app.use("/api", medicalClinicRoutes);
app.use("/api", parentRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", schoolRoutes); 
app.use("/api", profileRoutes);
app.use("/api/admin", adminRoutes);

const PORT = 5000;
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global JSON error handler — prevents Express from returning HTML error pages
app.use((err, req, res, next) => {
  console.error("Express error:", err.message || err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


module.exports = app;
