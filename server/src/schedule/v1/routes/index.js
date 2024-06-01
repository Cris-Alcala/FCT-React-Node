const express = require("express");
const scheduleController = require("../../controllers/scheduleController");

const router = express.Router();

router.get("/", scheduleController.getSchedule);
router.patch("/", scheduleController.updateSchedule);

module.exports = router;
