const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController.js");
const { authenticate } = require("../controllers/authController.js"); // الـ Middleware الخاص بك

// مسار لإتمام عملية دفع جديدة
router.post("/pay", authenticate, paymentController.createPayment);

// مسار لعرض تاريخ مدفوعات المستخدم
router.get("/my-history", authenticate, paymentController.getMyPayments);

module.exports = router;