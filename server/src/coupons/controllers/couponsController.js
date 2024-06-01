const couponsService = require("../services/couponsService");

const getAllCoupons = async (req, res) => {
  const { name } = req.query;
  try {
    res.status(200).json(couponsService.getAllCoupons({ name }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Coupon ID is required" });
    }
    res.status(200).json(couponsService.getCouponById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCoupon = async (req, res) => {
  try {
    const coupon = req.body;
    if (!coupon) {
      return res.status(400).json({ error: "Coupon data is required" });
    }
    res.status(201).json(await couponsService.addCoupon(coupon));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = req.body;
    if (!id) {
      return res.status(400).json({ error: "Coupon ID is required" });
    }
    if (!coupon) {
      return res.status(400).json({ error: "Coupon data is required" });
    }
    res.status(200).json(await couponsService.updateCoupon(id, coupon));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Coupon ID is required" });
    }
    res.status(200).json(couponsService.deleteCoupon(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
};
