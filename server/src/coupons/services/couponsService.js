const { v4: uuidv4 } = require("uuid");
const couponsDB = require("../database/couponsDB");

const getAllCoupons = (filterParams) => {
  try {
    return couponsDB.getAllCoupons(filterParams);
  } catch (error) {
    throw error;
  }
};

const getCouponById = (id) => {
  try {
    return couponsDB.getCouponById(id);
  } catch (error) {
    throw error;
  }
};

const addCoupon = (coupon) => {
  const newCoupon = {
    ...coupon,
    id: uuidv4(),
  };
  try {
    return couponsDB.addCoupon(newCoupon);
  } catch (error) {
    throw error;
  }
};

const updateCoupon = (id, coupon) => {
  try {
    return couponsDB.updateCoupon(id, coupon);
  } catch (error) {
    throw error;
  }
};

const deleteCoupon = (id) => {
  try {
    return couponsDB.deleteCoupon(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
};
