const express = require("express");
const couponsController = require("../../controllers/couponsController");

const router = express.Router();

router.get("/", couponsController.getAllCoupons);
router.get("/:id", couponsController.getCouponById);
router.post("/", couponsController.addCoupon);
router.patch("/:id", couponsController.updateCoupon);
router.delete("/:id", couponsController.deleteCoupon);

module.exports = router;
