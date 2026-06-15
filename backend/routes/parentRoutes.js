const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parentController");
const { authenticate } = require("../controllers/authController");

// ✅ MUST MATCH FRONTEND EXACTLY
router.get("/parents/me", authenticate, parentController.getParentInfo);
router.put("/parents/update", authenticate, parentController.updateParentInfo);

module.exports = router;