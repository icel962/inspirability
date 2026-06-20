const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");

router.get("/schools", schoolController.getSchools);
router.get("/schools/:id", schoolController.getSchoolById);

module.exports = router;
