const express = require("express");
const employeesController = require("../../controllers/employeesController");

const router = express.Router();

router.get("/", employeesController.getAllEmployees);
router.get("/:id", employeesController.getEmployeeById);
router.post("/", employeesController.addEmployee);
router.patch("/:id", employeesController.updateEmployee);
router.delete("/:id", employeesController.deleteEmployee);

module.exports = router;
