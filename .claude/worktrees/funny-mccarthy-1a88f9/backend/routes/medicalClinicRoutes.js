const express = require("express");
const router = express.Router();
const medicalClinicController = require("../controllers/medicalClinicController");

router.get("/medical", medicalClinicController.getAllMedicalClinics);
router.get("/medical/:id", medicalClinicController.getMedicalClinicById);

module.exports = router;
