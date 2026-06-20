const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../controllers/authController");

// CREATE
router.post("/appointments", authenticate, appointmentController.createAppointment);

// PROVIDER VIEW
router.get("/appointments/provider", authenticate, appointmentController.getProviderAppointments);

// PARENT VIEW
router.get("/appointments/my", authenticate, appointmentController.getParentAppointments);

// UPDATE STATUS
router.put("/appointments/:id", authenticate, appointmentController.updateAppointmentStatus);

// DELETE
router.delete(
  "/appointments/:id",
  authenticate,
  appointmentController.deleteAppointment
);

router.delete(
  "/appointments/provider/:id",
  authenticate,
  appointmentController.deleteProviderAppointment
);

module.exports = router;