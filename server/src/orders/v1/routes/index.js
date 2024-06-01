const express = require("express");
const ordersController = require("../../controllers/ordersController");

const router = express.Router();

router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.addOrder);
router.patch("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
