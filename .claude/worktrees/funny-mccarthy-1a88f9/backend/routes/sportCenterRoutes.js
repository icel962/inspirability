const express = require("express");
const router = express.Router();
const sportCenterController = require("../controllers/sportCenterController");

router.get("/sports", sportCenterController.getAllSportCenters);
router.get("/sports/:id", sportCenterController.getSportCenterById);

module.exports = router;
