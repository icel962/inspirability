const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../controllers/authController");

// Signup & Login
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put(
  "/hide-approval-message",
  authenticate,
  authController.hideApprovalMessage
);

router.put(
  "/hide-payment-message",
  authenticate,
  authController.hidePaymentMessage
);

module.exports = router;
