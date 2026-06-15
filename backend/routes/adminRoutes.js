const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const {
  authenticate,
} = require("../controllers/authController");

// =========================
// STATS & VISIT TRACKING
// =========================
router.get("/stats", authenticate, adminController.getStats);
router.post("/track-visit", adminController.trackVisit);

// =========================
// PROVIDER REQUESTS
// =========================
router.get(
  "/provider-requests",
  authenticate,
  adminController.getProviderRequests
);

router.put(
  "/approve-provider/:id",
  authenticate,
  adminController.approveProvider
);

router.put(
  "/reject-provider/:id",
  authenticate,
  adminController.rejectProvider
);

// =========================
// PAYMENT REQUESTS
// =========================
router.get(
  "/payment-requests",
  authenticate,
  adminController.getPaymentRequests
);

router.put(
  "/approve-payment/:id",
  authenticate,
  adminController.approvePayment
);

router.put(
  "/reject-payment/:id",
  authenticate,
  adminController.rejectPayment
);

module.exports = router;