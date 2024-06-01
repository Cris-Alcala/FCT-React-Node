const express = require("express");
const FSController = require("../../controllers/FSController");

const router = express.Router();

router.get("/", FSController.getAllFS);
router.get("/:id", FSController.getFSById);
router.post("/", FSController.addFS);
router.patch("/:id", FSController.updateFS);
router.delete("/:id", FSController.deleteFS);

module.exports = router;
